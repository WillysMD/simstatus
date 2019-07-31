from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PakViewSet, SaveViewSet, RevisionViewSet, RevisionLatestView, InstanceViewSet, InstanceInstallView, InstanceStartView

router = DefaultRouter()

router.register('paks', PakViewSet, basename='pak')
router.register('saves', SaveViewSet, basename='save')
router.register('revisions', RevisionViewSet, basename='revision')
router.register('instances', InstanceViewSet, basename='instance')
urlpatterns = router.urls

# Routes for instance actions
urlpatterns.append(path('revision/latest/', RevisionLatestView.as_view()))
urlpatterns.append(path('instances/<int:pk>/install/', InstanceInstallView.as_view()))
urlpatterns.append(path('instances/<int:pk>/start/', InstanceStartView.as_view()))
