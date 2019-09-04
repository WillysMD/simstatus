from rest_framework import serializers
from .models import Pak, Save, Revision, Simuconf, Instance
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


class PakNestedSerializer(PakSerializer):
    id = serializers.IntegerField()
    file = serializers.CharField()

    class Meta:
        model = Pak
        fields = '__all__'
        validators = []


class SaveSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Save
        fields = '__all__'


class SaveNestedSerializer(SaveSerializer):
    id = serializers.IntegerField()
    file = serializers.CharField()

    class Meta:
        model = Save
        fields = '__all__'
        validators = []


class RevisionSerializer(ProtectedSerializer):
    id = serializers.IntegerField(read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Revision
        fields = '__all__'

    def get_status(self, instance):
        local_revision = LocalRevision(instance)
        return local_revision.status


class RevisionNestedSerializer(RevisionSerializer):
    id = serializers.IntegerField()
    r = serializers.IntegerField()


class SimuconfSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Simuconf
        fields = '__all__'
        read_only_fields = ['default']


class InstanceSerializer(serializers.ModelSerializer):
    revision = RevisionNestedSerializer()
    pak = PakNestedSerializer()
    savegame = SaveNestedSerializer()
    status = serializers.SerializerMethodField()

    class Meta:
        model = Instance
        fields = ('status', 'url', 'name', 'port', 'lang', 'debug', 'revision', 'pak', 'savegame')

    def get_status(self, instance):
        local_instance = LocalInstance(instance)
        return local_instance.status

    def create(self, validated_data):
        revision = Revision.objects.get(id=validated_data.pop('revision')['id'])
        pak = Pak.objects.get(id=validated_data.pop('pak')['id'])
        savegame = Save.objects.get(id=validated_data.pop('savegame')['id'])

        return Instance.objects.create(**validated_data, revision=revision, pak=pak, savegame=savegame)

    def update(self, instance, validated_data):
        instance.revision = Revision.objects.get(id=validated_data.pop('revision')['id'])
        instance.pak = Pak.objects.get(id=validated_data.pop('pak')['id'])
        instance.savegame = Save.objects.get(id=validated_data.pop('savegame')['id'])

        return super(InstanceSerializer, self).update(instance, validated_data)
