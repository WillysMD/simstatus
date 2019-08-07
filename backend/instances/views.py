from subprocess import run, Popen, PIPE
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from .serializers import PakSerializer, SaveSerializer, RevisionSerializer, InstanceSerializer
from .models import Pak, Save, Revision, Instance
from .local import REPOSITORY_URL, LocalRevision, LocalInstance


class PakViewSet(viewsets.ModelViewSet):
    serializer_class = PakSerializer
    queryset = Pak.objects.all()


class SaveViewSet(viewsets.ModelViewSet):
    serializer_class = SaveSerializer
    queryset = Save.objects.all()


class RevisionViewSet(viewsets.ModelViewSet):
    serializer_class = RevisionSerializer
    queryset = Revision.objects.all()


class RevisionActionView(RetrieveAPIView):
    serializer_class = RevisionSerializer
    queryset = Revision.objects.all()

    def get_local_revision(self):
        return LocalRevision(self.get_object())


class RevisionBuildView(RevisionActionView):
    def get(self, request, *args, **kwargs):
        local_revision = self.get_local_revision()
        local_revision.build()
        
        return super(RevisionBuildView, self).get(request, *args, **kwargs)


class InstanceViewSet(viewsets.ModelViewSet):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()

    def update(self, request, *args, **kwargs):
        local_instance = LocalInstance(self.get_object())
        local_instance.rename(request.data['name'])
        return super(InstanceViewSet, self).update(request, *args, **kwargs)


class InstanceActionView(RetrieveAPIView):
    serializer_class = InstanceSerializer
    queryset = Instance.objects.all()

    def get_local_instance(self):
        return LocalInstance(self.get_object())


class InstanceInstallView(InstanceActionView):
    def get(self, request, *args, **kwargs):
        local_instance = self.get_local_instance()
        local_instance.install()

        return super(InstanceInstallView, self).get(request, *args, **kwargs)


class InstanceStartView(InstanceActionView):
    def get(self, request, **kwargs):
        local_instance = self.get_local_instance()
        pid = local_instance.start()

        if pid is not None:
            instance = self.get_object()
            instance.pid = pid
            instance.save()

        return super(InstanceStartView, self).get(request, **kwargs)


class InfoRevisionLatestView(APIView):
    def get(self, request):
        return Response(data=get_latest_revision())


class InfoLoadAvgView(APIView):
    def get(self, request):
        return Response(data=get_load_avg())


def get_latest_revision():
    # svn info | grep Revision | cut -c11-
    svn = Popen(['svn', 'info', REPOSITORY_URL], stdout=PIPE)
    grep = Popen(['grep', 'Revision'], stdin=svn.stdout, stdout=PIPE)
    cut = run(['cut', '-c11-'], stdin=grep.stdout, stdout=PIPE, encoding='utf-8')
    return cut.stdout.strip()


def get_load_avg():
    # cat /proc/loadavg
    cat = run(['cat', '/proc/loadavg'], stdout=PIPE, encoding='utf-8')
    return cat.stdout.strip()
