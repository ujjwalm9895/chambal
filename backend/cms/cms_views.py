from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.db.models import Count, Q, Sum
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import JsonResponse
import pandas as pd
import io

from .models import Category, Menu, Page, PageSection, Post, SiteSettings
from .cms_serializers import (
        CategorySerializer, MenuSerializer, MenuCreateUpdateSerializer, PageSerializer, 
        PageSectionSerializer, PageDetailSerializer
    )
from .cms_serializers import (
    PostListSerializer, PostDetailSerializer, PostCreateUpdateSerializer,
    DashboardStatsSerializer, SiteSettingsSerializer
)
from .permissions import IsAdminOrEditor, IsOwnerOrEditor, IsWriterOrAbove, IsAdmin


class DashboardStatsView(APIView):
    """Dashboard Statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Base queryset based on role
        if user.role == 'admin':
            posts_qs = Post.objects.all()
        elif user.role == 'editor':
            posts_qs = Post.objects.all()
        else:
            posts_qs = Post.objects.filter(author=user)
        
        stats = {
            'total_posts': posts_qs.count(),
            'published_posts': posts_qs.filter(status='published').count(),
            'pending_posts': posts_qs.filter(status='pending').count(),
            'draft_posts': posts_qs.filter(status='draft').count(),
            'scheduled_posts': posts_qs.filter(status='scheduled').count(),
            'featured_posts': posts_qs.filter(is_featured=True).count(),
            'slider_posts': posts_qs.filter(is_slider=True).count(),
            'breaking_posts': posts_qs.filter(is_breaking=True).count(),
            'total_views': posts_qs.aggregate(total=Sum('views_count'))['total'] or 0,
            'total_categories': Category.objects.filter(is_active=True).count(),
            'total_pages': Page.objects.filter(is_active=True).count(),
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)


class PostViewSet(viewsets.ModelViewSet):
    """Post ViewSet for CMS"""
    queryset = Post.objects.all().select_related('category', 'author')
    permission_classes = [IsAuthenticated, IsWriterOrAbove]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category', 'language', 'is_featured', 
                       'is_slider', 'is_breaking', 'author']
    search_fields = ['title', 'content', 'slug']
    ordering_fields = ['created_at', 'updated_at', 'publish_at', 'views_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PostCreateUpdateSerializer
        elif self.action == 'retrieve':
            return PostDetailSerializer
        return PostListSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        
        # Filter by role
        if user.role == 'writer':
            queryset = queryset.filter(author=user)
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by special flags
        if self.request.query_params.get('featured') == 'true':
            queryset = queryset.filter(is_featured=True)
        if self.request.query_params.get('slider') == 'true':
            queryset = queryset.filter(is_slider=True)
        if self.request.query_params.get('breaking') == 'true':
            queryset = queryset.filter(is_breaking=True)
        if self.request.query_params.get('recommended') == 'true':
            queryset = queryset.filter(is_recommended=True)
        
        return queryset
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsOwnerOrEditor()]
        return super().get_permissions()
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=False, methods=['post'])
    def bulk_upload(self, request):
        """Bulk upload posts from CSV"""
        if request.user.role not in ['admin', 'editor']:
            return Response(
                {'error': 'Only admins and editors can bulk upload'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'file' not in request.FILES:
            return Response(
                {'error': 'No file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        try:
            # Read CSV
            df = pd.read_csv(io.StringIO(file.read().decode('utf-8')))
            
            # Validate columns
            required_columns = ['title', 'content', 'category']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                return Response(
                    {'error': f'Missing columns: {", ".join(missing_columns)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Process rows
            errors = []
            created = []
            
            for index, row in df.iterrows():
                try:
                    # Get category
                    category_name = str(row.get('category', '')).strip()
                    if not category_name:
                        errors.append(f'Row {index + 2}: Category is required')
                        continue
                    
                    category = Category.objects.filter(name__iexact=category_name).first()
                    if not category:
                        errors.append(f'Row {index + 2}: Category "{category_name}" not found')
                        continue
                    
                    # Create post
                    post_data = {
                        'title': str(row.get('title', '')).strip(),
                        'content': str(row.get('content', '')).strip(),
                        'category': category,
                        'author': request.user,
                        'status': str(row.get('status', 'draft')).strip(),
                        'language': str(row.get('language', 'en')).strip(),
                        'excerpt': str(row.get('excerpt', '')).strip()[:500] if pd.notna(row.get('excerpt')) else '',
                    }
                    
                    # Handle publish_at if provided
                    if pd.notna(row.get('publish_at')):
                        try:
                            from dateutil import parser
                            post_data['publish_at'] = parser.parse(str(row['publish_at']))
                            if post_data['publish_at'] > timezone.now():
                                post_data['status'] = 'scheduled'
                        except:
                            pass
                    
                    post = Post.objects.create(**post_data)
                    created.append(post.id)
                    
                except Exception as e:
                    errors.append(f'Row {index + 2}: {str(e)}')
            
            return Response({
                'success': True,
                'created': len(created),
                'errors': errors,
                'created_ids': created[:10],  # Return first 10 IDs
            })
            
        except Exception as e:
            return Response(
                {'error': f'Error processing file: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve pending post (Editor/Admin only)"""
        if request.user.role not in ['admin', 'editor']:
            return Response(
                {'error': 'Only editors and admins can approve posts'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        post = self.get_object()
        if post.status != 'pending':
            return Response(
                {'error': 'Post is not pending approval'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        post.status = 'published'
        if not post.publish_at:
            post.publish_at = timezone.now()
        post.save()
        
        return Response({'message': 'Post approved and published'})


class CategoryViewSet(viewsets.ModelViewSet):
    """Category ViewSet"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]  # Base permission, detailed in get_permissions
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['language', 'is_active']
    search_fields = ['name', 'slug']
    
    def get_permissions(self):
        """
        Writers can view and create categories (needed for post creation).
        Only admins/editors can update or delete categories.
        """
        if self.action in ['list', 'retrieve', 'create']:
            # Allow all authenticated users to view and create categories
            permission_classes = [IsAuthenticated, IsWriterOrAbove]
        else:
            # Only admins/editors can modify or delete categories
            permission_classes = [IsAuthenticated, IsAdminOrEditor]
        return [permission() for permission in permission_classes]


class MenuViewSet(viewsets.ModelViewSet):
    """Menu ViewSet"""
    queryset = Menu.objects.all().select_related('category', 'page')
    permission_classes = [IsAuthenticated]  # Base permission, detailed in get_permissions
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['menu_type', 'is_active']
    ordering = ['menu_type', 'order']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return MenuCreateUpdateSerializer
        return MenuSerializer
    
    def get_permissions(self):
        """
        Writers can view menus (for reference).
        Only admins/editors can create, update, or delete menus.
        """
        if self.action in ['list', 'retrieve']:
            # Allow all authenticated users to view menus
            permission_classes = [IsAuthenticated, IsWriterOrAbove]
        else:
            # Only admins/editors can modify menus
            permission_classes = [IsAuthenticated, IsAdminOrEditor]
        return [permission() for permission in permission_classes]


class PageViewSet(viewsets.ModelViewSet):
    """Page ViewSet"""
    queryset = Page.objects.all().prefetch_related('sections')
    permission_classes = [IsAuthenticated, IsAdminOrEditor]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['title', 'slug']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PageDetailSerializer
        return PageSerializer


class PageSectionViewSet(viewsets.ModelViewSet):
    """Page Section ViewSet"""
    queryset = PageSection.objects.all().select_related('page')
    serializer_class = PageSectionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrEditor]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['page', 'section_type', 'is_active']
    ordering = ['page', 'order']


class SiteSettingsView(APIView):
    """Site Settings View - GET and PUT (Singleton)"""
    permission_classes = [IsAuthenticated, IsAdmin]
    
    def get(self, request):
        """Get site settings"""
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request):
        """Update site settings"""
        settings = SiteSettings.get_settings()
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """Partial update site settings"""
        return self.put(request)
