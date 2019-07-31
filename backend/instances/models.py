from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class ExternalFile(models.Model):
    name = models.TextField()
    version = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        abstract = True
        unique_together = ('name', 'version')


def pak_file_path(pak, filename):
    return f'paks/{pak.name}-{pak.version}.zip'


class Pak(ExternalFile):
    file = models.FileField(upload_to=pak_file_path)


def save_file_path(save, filename):
    return f'saves/{save.name}-{save.version}.sve'


class Save(ExternalFile):
    file = models.FileField(upload_to=save_file_path)


class Revision(models.Model):
    r = models.IntegerField(unique=True)
    alias = models.TextField(null=True, unique=True)


class Instance(models.Model):
    name = models.TextField(unique=True)
    pid = models.IntegerField(null=True)

    # Instance configuration
    port = models.IntegerField(unique=True, default=13353)
    lang = models.TextField(max_length=2, default='en')
    debug = models.IntegerField(default=2, validators=[MinValueValidator(0), MaxValueValidator(3)])
    # TODO: client handle null values and block install
    revision = models.ForeignKey(Revision, on_delete=models.PROTECT, null=True)
    pak = models.ForeignKey(Pak, on_delete=models.PROTECT, null=True)
    savegame = models.ForeignKey(Save, on_delete=models.PROTECT, null=True)
