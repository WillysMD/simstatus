from rest_framework import serializers
from .models import Pak, Save, Revision, Instance
from .local import LocalRevision, LocalInstance


class ProtectedSerializer(serializers.HyperlinkedModelSerializer):
    protected = serializers.SerializerMethodField()

    def get_protected(self, instance):
        if instance.instance_set.count() > 0:
            return True
        else:
            return False


class PakSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Pak
        fields = '__all__'


class SaveSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Save
        fields = '__all__'


class RevisionSerializer(ProtectedSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Revision
        fields = '__all__'

    def get_status(self, instance):
        local_revision = LocalRevision(instance)
        return local_revision.status


class InstanceSerializer(serializers.HyperlinkedModelSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = Instance
        fields = ('status', 'url', 'name', 'port', 'lang', 'debug', 'revision', 'pak', 'savegame')

    def get_status(self, instance):
        local_instance = LocalInstance(instance)
        return local_instance.status
