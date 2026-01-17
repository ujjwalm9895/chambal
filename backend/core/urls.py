"""
URL configuration for Chambal Sandesh project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet

# Router for CMS APIs
cms_users_router = DefaultRouter()
cms_users_router.register(r'cms/users', UserViewSet, basename='cms-user')

urlpatterns = [
    path('admin/', admin.site.urls),  # Fallback admin - not for CMS UI
    path('api/auth/', include('users.urls')),
    path('api/', include(cms_users_router.urls)),
    path('api/', include('cms.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
