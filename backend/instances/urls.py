from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PakViewSet, SaveViewSet, RevisionViewSet, SimuconfViewSet, InstanceViewSet, InfoLoadAvgView, \
    InfoRevisionLatestView


class OptionalSlashRouter(DefaultRouter):
    def __init__(self, *args, **kwargs):
        self.trailing_slash = '/?'
        super(OptionalSlashRouter, self).__init__(*args, **kwargs)


router = OptionalSlashRouter()

router.register('paks', PakViewSet, basename='pak')
router.register('saves', SaveViewSet, basename='save')
router.register('revisions', RevisionViewSet, basename='revision')
router.register('simuconf', SimuconfViewSet, basename='simuconf')
router.register('instances', InstanceViewSet, basename='instance')
urlpatterns = router.urls

# Additional routes for general infos
urlpatterns.append(path('info/loadavg/', InfoLoadAvgView.as_view()))
urlpatterns.append(path('info/revision/latest/', InfoRevisionLatestView.as_view()))
