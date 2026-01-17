from django.urls import path, include
from rest_framework.routers import DefaultRouter

# CMS APIs (Authenticated)
from .cms_views import (
    DashboardStatsView, PostViewSet, CategoryViewSet,
    MenuViewSet, PageViewSet, PageSectionViewSet, SiteSettingsView
)

# Public APIs (No Auth)
from .public_views import (
    PublicCategoryViewSet, PublicMenuViewSet, PublicPostViewSet,
    PublicPageViewSet, HomepageViewSet
)

# CMS Router
cms_router = DefaultRouter()
cms_router.register(r'posts', PostViewSet, basename='cms-post')
cms_router.register(r'categories', CategoryViewSet, basename='cms-category')
cms_router.register(r'menus', MenuViewSet, basename='cms-menu')
cms_router.register(r'pages', PageViewSet, basename='cms-page')
cms_router.register(r'page-sections', PageSectionViewSet, basename='cms-page-section')

# Public Router
public_router = DefaultRouter()
public_router.register(r'categories', PublicCategoryViewSet, basename='category')
public_router.register(r'menus', PublicMenuViewSet, basename='menu')
public_router.register(r'articles', PublicPostViewSet, basename='article')
public_router.register(r'pages', PublicPageViewSet, basename='page')
public_router.register(r'homepage', HomepageViewSet, basename='homepage')

urlpatterns = [
    # CMS APIs
    path('cms/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('cms/settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('cms/', include(cms_router.urls)),
    
    # Public APIs
    path('', include(public_router.urls)),
]
