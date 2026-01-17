from rest_framework import serializers
from .models import Category, Menu, Page, PageSection, Post, SiteSettings
from users.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    """Category Serializer"""
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    posts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'language', 'language_display', 
                  'show_in_menu', 'menu_order', 'is_active', 'posts_count',
                  'created_at', 'updated_at']
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }
    
    def get_posts_count(self, obj):
        return obj.posts.filter(status='published').count()


class PostListSerializer(serializers.ModelSerializer):
    """Post List Serializer for CMS"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    author_name = serializers.CharField(source='author.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'excerpt', 'category', 'category_name',
                  'author', 'author_name', 'language', 'language_display',
                  'status', 'status_display', 'is_featured', 'is_slider',
                  'is_breaking', 'is_recommended', 'publish_at', 'views_count',
                  'featured_image', 'featured_image_url', 'created_at', 'updated_at']
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class PostDetailSerializer(serializers.ModelSerializer):
    """Post Detail Serializer for CMS"""
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    video_url_display = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'category',
                  'author', 'language', 'language_display', 'status', 'status_display',
                  'is_featured', 'is_slider', 'is_breaking', 'is_recommended',
                  'publish_at', 'seo_title', 'seo_description', 'views_count',
                  'featured_image', 'featured_image_url', 'video', 'video_url', 'video_url_display',
                  'created_at', 'updated_at']
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None
    
    def get_video_url_display(self, obj):
        if obj.video:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.video.url)
            return obj.video.url
        return None


class PostCreateUpdateSerializer(serializers.ModelSerializer):
    """Post Create/Update Serializer"""
    
    class Meta:
        model = Post
        fields = ['title', 'slug', 'content', 'excerpt', 'category', 'language',
                  'status', 'is_featured', 'is_slider', 'is_breaking', 'is_recommended',
                  'publish_at', 'seo_title', 'seo_description', 'featured_image', 'video', 'video_url']
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'slug': {'required': False, 'allow_blank': True},
            'excerpt': {'required': False, 'allow_blank': True},
            'seo_title': {'required': False, 'allow_blank': True},
            'seo_description': {'required': False, 'allow_blank': True},
            'video': {'required': False, 'allow_null': True},
            'video_url': {'required': False, 'allow_blank': True, 'allow_null': True},
        }
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class MenuSerializer(serializers.ModelSerializer):
    """Menu Serializer for Read Operations"""
    menu_type_display = serializers.CharField(source='get_menu_type_display', read_only=True)
    link_type_display = serializers.CharField(source='get_link_type_display', read_only=True)
    url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    page = serializers.SerializerMethodField()
    
    class Meta:
        model = Menu
        fields = ['id', 'title', 'menu_type', 'menu_type_display', 'link_type', 
                  'link_type_display', 'category', 'page', 'external_url', 'url', 
                  'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_url(self, obj):
        return obj.get_url()
    
    def get_category(self, obj):
        if obj.category:
            return {
                'id': obj.category.id,
                'name': obj.category.name,
                'slug': obj.category.slug,
                'language': obj.category.language,
            }
        return None
    
    def get_page(self, obj):
        if obj.page:
            return {
                'id': obj.page.id,
                'title': obj.page.title,
                'slug': obj.page.slug,
            }
        return None


class MenuCreateUpdateSerializer(serializers.ModelSerializer):
    """Menu Serializer for Create/Update Operations - accepts category/page IDs"""
    
    class Meta:
        model = Menu
        fields = ['title', 'menu_type', 'link_type', 'category', 'page', 
                  'external_url', 'order', 'is_active']
        extra_kwargs = {
            'category': {'required': False, 'allow_null': True},
            'page': {'required': False, 'allow_null': True},
            'external_url': {'required': False, 'allow_blank': True, 'allow_null': True},
        }


class PageSerializer(serializers.ModelSerializer):
    """Page Serializer"""
    sections_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'seo_title', 'seo_description', 
                  'is_active', 'sections_count', 'created_at', 'updated_at']
    
    def get_sections_count(self, obj):
        return obj.sections.count()


class PageSectionSerializer(serializers.ModelSerializer):
    """Page Section Serializer"""
    section_type_display = serializers.CharField(source='get_section_type_display', read_only=True)
    
    class Meta:
        model = PageSection
        fields = ['id', 'page', 'section_type', 'section_type_display', 'data', 
                  'order', 'is_active', 'created_at', 'updated_at']


class PageDetailSerializer(serializers.ModelSerializer):
    """Page Detail with Sections"""
    sections = PageSectionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'seo_title', 'seo_description', 
                  'is_active', 'sections', 'created_at', 'updated_at']


# Dashboard Stats Serializer
class DashboardStatsSerializer(serializers.Serializer):
    """Dashboard Statistics"""
    total_posts = serializers.IntegerField()
    published_posts = serializers.IntegerField()
    pending_posts = serializers.IntegerField()
    draft_posts = serializers.IntegerField()
    scheduled_posts = serializers.IntegerField()
    featured_posts = serializers.IntegerField()
    slider_posts = serializers.IntegerField()
    breaking_posts = serializers.IntegerField()
    total_views = serializers.IntegerField()
    total_categories = serializers.IntegerField()
    total_pages = serializers.IntegerField()


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Site Settings Serializer"""
    site_logo_url = serializers.SerializerMethodField()
    site_favicon_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'site_tagline', 'site_logo', 'site_logo_url',
            'site_favicon', 'site_favicon_url', 'contact_email', 'contact_phone',
            'contact_address', 'facebook_url', 'twitter_url', 'instagram_url',
            'youtube_url', 'linkedin_url', 'default_seo_title', 'default_seo_description',
            'default_seo_keywords', 'posts_per_page', 'enable_comments',
            'enable_registration', 'maintenance_mode', 'maintenance_message',
            'google_analytics_id', 'facebook_pixel_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_site_logo_url(self, obj):
        if obj.site_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.site_logo.url)
            return obj.site_logo.url
        return None
    
    def get_site_favicon_url(self, obj):
        if obj.site_favicon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.site_favicon.url)
            return obj.site_favicon.url
        return None


class SiteSettingsSerializer(serializers.ModelSerializer):
    """Site Settings Serializer"""
    site_logo_url = serializers.SerializerMethodField()
    site_favicon_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'site_name', 'site_tagline', 'site_logo', 'site_logo_url',
            'site_favicon', 'site_favicon_url', 'contact_email', 'contact_phone',
            'contact_address', 'facebook_url', 'twitter_url', 'instagram_url',
            'youtube_url', 'linkedin_url', 'default_seo_title', 'default_seo_description',
            'default_seo_keywords', 'posts_per_page', 'enable_comments',
            'enable_registration', 'maintenance_mode', 'maintenance_message',
            'google_analytics_id', 'facebook_pixel_id', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_site_logo_url(self, obj):
        if obj.site_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.site_logo.url)
            return obj.site_logo.url
        return None
    
    def get_site_favicon_url(self, obj):
        if obj.site_favicon:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.site_favicon.url)
            return obj.site_favicon.url
        return None
