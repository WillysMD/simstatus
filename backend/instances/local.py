import os
import psutil
import shutil
import zipfile
import multiprocessing
from subprocess import Popen, STDOUT
from django.conf import settings

RESOURCES_DIR = os.path.join(settings.BASE_DIR, 'resources')
BUILD_DIR = os.path.join(RESOURCES_DIR, 'builds')
BUILD_CONFIG = os.path.join(RESOURCES_DIR, 'builds', 'config.default')
REPOSITORY_URL = 'svn://servers.simutrans.org/simutrans/trunk'


class LocalRevision:
    def __init__(self, revision):
        self._revision = revision
        self.r = str(revision.r)
        self.dir = os.path.join(BUILD_DIR, self.r)
        self._create_dir()

        self.clone_path = os.path.join(self.dir, 'code')
        self.install_path = os.path.join(self.dir, 'simutrans')
        self.build_file = os.path.join(self.dir, 'building')

    @property
    def status(self):
        if self.is_installed():
            return 0
        elif self.is_building():
            return 1
        elif self.is_compiled():
            return 2
        elif self.is_cloned():
            return 3
        else:
            return 4

    def is_building(self):
        return os.path.exists(self.build_file)

    def is_cloned(self):
        return os.path.exists(os.path.join(self.clone_path, 'simmain.cc'))

    def is_compiled(self):
        return os.path.exists(os.path.join(self.clone_path, 'build', 'default', 'sim'))

    def is_installed(self):
        return os.path.exists(os.path.join(self.install_path, 'sim'))

    def build(self):
        if not self.is_building():
            try:
                with open(self.build_file, 'w'):
                    self._clone()
                    self._compile()
                    self._install()
            except OSError:
                pass
            finally:
                os.remove(self.build_file)

    def _create_dir(self):
        if not os.path.exists(self.dir):
            os.makedirs(self.dir)

    def _clone(self):
        if not self.is_cloned():
            with open(os.path.join(self.dir, '1_svn.log'), 'a') as log:
                svn = Popen(['svn', 'co', '--username', 'anon', '-r', self.r,
                             REPOSITORY_URL, self.clone_path],
                            stdout=log, stderr=STDOUT)
                svn.wait()
            shutil.copy(BUILD_CONFIG, self.clone_path)

    def _compile(self):
        if self.is_cloned() and not self.is_compiled():
            with open(os.path.join(self.dir, '2_make.log'), 'a') as log:
                jobs = multiprocessing.cpu_count() + 1
                make = Popen(['make', f'-j{jobs}'], cwd=self.clone_path, stdout=log, stderr=STDOUT)
                make.wait()
                strip = Popen(['strip', os.path.join(self.clone_path, 'build', 'default', 'sim')],
                              stdout=log, stderr=STDOUT)
                strip.wait()

    def _install(self):
        if self.is_compiled() and not self.is_installed():
            shutil.copytree(os.path.join(self.clone_path, 'simutrans'), self.install_path)
            shutil.copy(os.path.join(self.clone_path, 'build', 'default', 'sim'), self.install_path)
            shutil.copy(os.path.join(self.clone_path, 'get_lang_files.sh'), self.dir)
            with open(os.path.join(self.dir, '3_get_lang_files.log'), 'a') as log:
                get_lang_files = Popen([os.path.join(self.dir, 'get_lang_files.sh')],
                                       cwd=self.dir, stdout=log, stderr=STDOUT)
                get_lang_files.wait()

            shutil.rmtree(self.clone_path, ignore_errors=True)

    def remove(self):
        shutil.rmtree(self.dir, ignore_errors=True)


# TODO: improve comments
# TODO: detect errors and throw exceptions when possible, better error handling overall
class LocalInstance:
    def __init__(self, instance):
        # Instance model
        self._instance = instance
        # Local revision in case compilation or installation is needed
        self._local_revision = LocalRevision(instance.revision)
        # Revision number
        self.r = str(instance.revision.r)

        # Directory in which instance files are located
        self.dir = os.path.join(RESOURCES_DIR, 'instances', instance.name)
        # Diectory in which the server is installed
        self.revision_dir = os.path.join(self.dir, self.r)
        # Path to the server executable
        self.server_exec = os.path.join(self.revision_dir, 'sim')

        # Path to the uploaded pak
        self.pak = instance.pak.file.path
        # Name of the pak (to use as server start argument)
        self.pak_name = (self.pak.rsplit('/', 1)[-1]).rsplit('.', 1)[0]
        # Path to the installed pak
        self.pak_dir = os.path.join(self.revision_dir, self.pak_name)

        # Path to the uploaded savegame
        self.savegame = instance.savegame.file.path
        # Name of the savegame (to use as server start argument)
        self.savegame_name = (self.savegame.rsplit('/', 1)[-1]).rsplit('.', 1)[0]
        # Path to the installed savegame
        self.savegame_file = os.path.join(self.revision_dir, self.savegame_name + '.sve')

        # Saved pid, process might have died
        self._pid = instance.pid

        self.port = str(instance.port)
        self.debug = str(instance.debug)
        self.lang = instance.lang

        self._create_dir()

    @property
    def pid(self):
        try:
            process = psutil.Process(self._pid)
        except psutil.NoSuchProcess:
            return None
        else:
            if process.status == psutil.STATUS_RUNNING:
                return self._pid
            else:
                return None

    @property
    def status(self):
        """Returns the status code"""
        if self.is_running():
            return 0
        elif self.is_installed():
            return 1
        elif self._local_revision.is_building():
            return 2
        else:
            return 3

    def _create_dir(self):
        if not os.path.exists(self.dir):
            os.makedirs(self.dir)

    def _is_revision_installed(self):
        return os.path.exists(self.server_exec)

    def _is_pak_installed(self):
        return os.path.exists(self.pak_dir)

    def _is_savegame_installed(self):
        return os.path.exists(self.savegame_file)

    def is_installed(self):
        """Check if all the files are installed"""
        if not self._is_revision_installed():
            return False
        elif not self._is_savegame_installed():
            return False
        elif not self._is_pak_installed():
            return False
        else:
            return True

    def is_running(self):
        if self.pid is None:
            return False
        else:
            return True

    def remove(self):
        """Remove all the directories and files associated with the instance
        This will not remove any paks or saves
        """
        shutil.rmtree(self.dir, ignore_errors=True)

    def install(self):
        """Copy the right revision to the instance directory and copy the paks and saves

        :raises LocalRevisionBuilding if the revision was not built
        :raises LocalRevisionMissing if the revision was not built
        """
        if not self._is_revision_installed():
            if self._local_revision.is_installed():
                # Copy the right revsion
                shutil.copytree(self._local_revision.install_path, self.revision_dir)
        if not self._is_savegame_installed():
            # Copy the right savegame
            shutil.copyfile(self.savegame, self.savegame_file)
        if not self._is_pak_installed():
            # Unzip the pak
            with zipfile.ZipFile(self.pak, 'r') as zip_ref:
                zip_ref.extractall(self.revision_dir)

    def start(self):
        """Start the server"""
        if not self.is_running():
            cmd = [self.server_exec, '-server', self.port, '-debug', self.debug, '-lang', self.lang,
                   '-objects', self.pak_name, '-load', self.savegame_name]
            sim = Popen(cmd)
            self._pid = sim.pid
        return self._pid

    def stop(self):
        """Stop the server"""
        pass

    def restart(self):
        """Restart the server"""
        self.stop()
        self.start()

    def reload(self):
        """Stop the server and reinstall pak, saves and new revsion, then restart"""
        self.stop()
        self.install()
        self.start()
