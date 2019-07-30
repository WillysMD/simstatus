import os
from django.dispatch import receiver
from django.db.models.signals import post_save, post_delete
from .models import Instance, Pak, Save, Revision
from .local import LocalRevision, LocalInstance


@receiver(post_delete, sender=Instance)
def on_instance_delete(instance, **kwargs):
    """When an instance is deleted, delete all the instance's directory and all the files"""
    local_instance = LocalInstance(instance)
    local_instance.remove()


@receiver(post_delete, sender=Pak)
@receiver(post_delete, sender=Save)
def on_file_delete(instance, **kwargs):
    """When a save or a pak is deleted, delete the file"""
    try:
        os.remove(instance.file.path)
    except FileNotFoundError:
        return


@receiver(post_save, sender=Revision)
def on_revision_save(instance, **kwargs):
    """When a revision is created, try to compile it"""
    local_revision = LocalRevision(instance)
    local_revision.build()


@receiver(post_delete, sender=Revision)
def on_revision_delete(instance, **kwargs):
    """When a revision is deleted, delete the directory"""
    local_revision = LocalRevision(instance)
    local_revision.remove()
