from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q, Prefetch
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Category, Menu, Page, PageSection, Post
from .public_serializers import (
    PublicCategorySerializer, PublicMenuSerializer,
    PublicPostListSerializer, PublicPostDetailSerializer,
    PublicPageSerializer, HomepageSerializer
)


class PublicCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Public Category ViewSet"""
    queryset = Category.objects.filter(is_active=True)
    serializer_class = PublicCategorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['language']
    search_fields = ['name', 'slug']
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        lang = self.request.query_params.get('lang', None)
        if lang:
            queryset = queryset.filter(language=lang)
        return queryset.order_by('menu_order', 'name')


class PublicMenuViewSet(viewsets.ReadOnlyModelViewSet):
    """Public Menu ViewSet"""
    queryset = Menu.objects.filter(is_active=True)
    serializer_class = PublicMenuSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['menu_type']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        menu_type = self.request.query_params.get('menu_type', None)
        if menu_type:
            queryset = queryset.filter(menu_type=menu_type)
        return queryset.order_by('menu_type', 'order', 'title')


class PublicPostViewSet(viewsets.ReadOnlyModelViewSet):
    """Public Post ViewSet"""
    queryset = Post.objects.filter(
        status='published',
        publish_at__lte=timezone.now()
    ).select_related('category')
    serializer_class = PublicPostListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['language', 'is_featured', 'is_slider', 'is_breaking']
    search_fields = ['title', 'content', 'slug']
    ordering_fields = ['publish_at', 'created_at', 'views_count']
    ordering = ['-publish_at']
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PublicPostDetailSerializer
        return PublicPostListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category slug if provided
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by language if provided
        lang = self.request.query_params.get('lang', None)
        if lang:
            queryset = queryset.filter(language=lang)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Increment view count when post is viewed"""
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured posts"""
        posts = self.get_queryset().filter(is_featured=True)[:10]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def slider(self, request):
        """Get slider posts"""
        posts = self.get_queryset().filter(is_slider=True)[:10]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def breaking(self, request):
        """Get breaking news posts"""
        posts = self.get_queryset().filter(is_breaking=True)[:10]
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class PublicPageViewSet(viewsets.ReadOnlyModelViewSet):
    """Public Page ViewSet"""
    queryset = Page.objects.filter(is_active=True).prefetch_related(
        Prefetch('sections', queryset=PageSection.objects.filter(is_active=True).order_by('order'))
    )
    serializer_class = PublicPageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    lookup_url_kwarg = 'slug'


class HomepageViewSet(viewsets.ViewSet):
    """Homepage ViewSet - Aggregates data for homepage"""
    permission_classes = [AllowAny]
    
    def list(self, request):
        """Get homepage data - Main endpoint"""
        return self.get_homepage_data(request)
    
    @action(detail=False, methods=['get'], url_path='homepage')
    def homepage_action(self, request):
        """Get homepage data - Alternative endpoint"""
        return self.get_homepage_data(request)
    
    def get_homepage_data(self, request):
        """Get homepage data"""
        # Get all menus
        all_menus = Menu.objects.filter(is_active=True).order_by('menu_type', 'order')
        
        # Get active categories
        categories = Category.objects.filter(
            is_active=True,
            show_in_menu=True
        ).order_by('menu_order')
        
        # Filter by language if provided
        lang = request.query_params.get('lang', None)
        if lang:
            categories = categories.filter(language=lang)
        
        # Get featured posts
        featured_posts = Post.objects.filter(
            status='published',
            is_featured=True,
            publish_at__lte=timezone.now()
        ).select_related('category').order_by('-publish_at')[:6]
        
        # Get slider posts
        slider_posts = Post.objects.filter(
            status='published',
            is_slider=True,
            publish_at__lte=timezone.now()
        ).select_related('category').order_by('-publish_at')[:10]
        
        # Get breaking news
        breaking_posts = Post.objects.filter(
            status='published',
            is_breaking=True,
            publish_at__lte=timezone.now()
        ).select_related('category').order_by('-publish_at')[:5]
        
        # Get latest posts (all published posts, most recent first)
        latest_posts = Post.objects.filter(
            status='published',
            publish_at__lte=timezone.now()
        ).select_related('category').order_by('-publish_at')[:20]
        
        # Try to get homepage page (optional)
        homepage_page = None
        try:
            homepage_page = Page.objects.filter(
                is_active=True,
                slug='home'
            ).prefetch_related(
                Prefetch('sections', queryset=PageSection.objects.filter(is_active=True).order_by('order'))
            ).first()
        except Exception as e:
            print(f"Error fetching homepage page: {e}")
            pass
        
        serializer = HomepageSerializer({
            'menus': all_menus,
            'categories': categories,
            'featured_posts': featured_posts,
            'slider_posts': slider_posts,
            'breaking_posts': breaking_posts,
            'latest_posts': latest_posts,
            'homepage_page': homepage_page,
        }, context={'request': request})
        
        return Response(serializer.data)
