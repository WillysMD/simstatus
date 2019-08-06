from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PakViewSet, SaveViewSet, RevisionViewSet, RevisionBuildView, InstanceViewSet, InstanceInstallView, \
    InstanceStartView, InfoLoadAvgView, InfoRevisionLatestView

router = DefaultRouter()

router.register('paks', PakViewSet, basename='pak')
router.register('saves', SaveViewSet, basename='save')
router.register('revisions', RevisionViewSet, basename='revision')
router.register('instances', InstanceViewSet, basename='instance')
urlpatterns = router.urls

# Routes for revision actions
urlpatterns.append(path('revisions/<int:pk>/build/', RevisionBuildView.as_view()))

# Routes for instance actions
urlpatterns.append(path('instances/<int:pk>/install/', InstanceInstallView.as_view()))
urlpatterns.append(path('instances/<int:pk>/start/', InstanceStartView.as_view()))

# Routes for general infos
urlpatterns.append(path('info/loadavg/', InfoLoadAvgView.as_view()))
urlpatterns.append(path('info/revision/latest/', InfoRevisionLatestView.as_view()))
