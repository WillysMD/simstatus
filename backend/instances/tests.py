from unittest import TestCase

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Pak


class PaksAPITests(APITestCase):
    def test_create_pak(self):
        """
        Ensure we can create a pak and uploaded file is handled properly
        """
        url = reverse('pak-list')
        file = SimpleUploadedFile('test.abc', b'content')
        data = {
            'name': 'test_pak',
            'version': '1.0',
            'file': file,
        }

        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pak.objects.count(), 1)
        self.assertEqual(Pak.objects.get().name, 'test_pak')
        self.assertEqual(Pak.objects.get().version, '1.0')
        self.assertEqual(Pak.objects.get().file.read(), b'content')
        self.assertRegex(Pak.objects.get().file.name, r'paks/test_pak-1.0.*\.zip')

    def test_delete_pak(self):
        """
        Ensure we can delete a pak and that the asoociated file is removed from the file system
        """
        pak = self.setup_pak()
        self.assertEqual(Pak.objects.count(), 1)

        url = reverse('pak-detail', args=[pak.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Pak.objects.count(), 0)

    def setup_pak(self):
        file = SimpleUploadedFile('test.abc', b'content')
        pak = Pak(name='test_pak', version='1.0', file=file)
        pak.save()

        return pak


class RevisionTests(APITestCase):
    pass


class InstanceTests(APITestCase):
    pass


class LocalRevision(TestCase):
    pass


class LocalInstance(TestCase):
    pass


# class InstanceTests(TestCase):
#     def test_create_with_null_pak_save(self):
#         instance = Instance.objects.create(name='Test', port=1, revision=1, pak=None, save=None)
#
#
# @override_settings(MEDIA_ROOT='test/resources')
# class InstanceRelationsTests(TestCase):
#     def setUp(self):
#         pak_file = SimpleUploadedFile(os.path.join(settings.MEDIA_ROOT, 'paks/test.pak'), content=b'')
#         save_file = SimpleUploadedFile(os.path.join(settings.MEDIA_ROOT, 'saves/test.sve'), content=b'')
#
#         self.pak = Pak.objects.create(name='TestPak', version='1.0.0', file=pak_file)
#         self.savegame = Save.objects.create(name='TestSave', version='1.0.0', file=save_file)
#
#         self.instance = Instance.objects.create(name='TestInstance', port=1, revision=1,
#                                                 pak=self.pak, savegame=self.savegame)
#
#     def tearDown(self):
#         shutil.rmtree('test')
#
#     def test_delete_pak(self):
#         with self.assertRaises(ProtectedError):
#             self.pak.delete()
#
#     def test_delete_save(self):
#         with self.assertRaises(ProtectedError):
#             self.savegame.delete()
#
#
# class LocalInstanceTests(SimpleTestCase):
#     def setUp(self):
#         self.name = 'test'
#         self.base_dir = 'test/instances'
#         self.instance = LocalInstance(name=self.name, base_dir=self.base_dir)
#
#     def tearDown(self):
#         pass
#         #shutil.rmtree('test')
#
#     def check_directory_created(self):
#         return os.path.exists(self.instance._path)
#
#     def test_create_directory_readonly(self):
#         # Make instances directory read only
#         os.makedirs(self.base_dir, 0o444)
#         self.instance._create_directory()
#
#         self.assertFalse(self.check_directory_created())
