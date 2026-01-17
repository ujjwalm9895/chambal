from rest_framework import serializers
from .models import Category, Menu, Page, PageSection, Post


class PublicCategorySerializer(serializers.ModelSerializer):
    """Public Category Serializer"""
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'language', 'language_display', 
                  'show_in_menu', 'menu_order']


class PublicPostListSerializer(serializers.ModelSerializer):
    """Public Post List Serializer"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'excerpt', 'category', 'category_name', 
                  'category_slug', 'featured_image', 'featured_image_url',
                  'is_featured', 'is_slider', 'is_breaking', 'publish_at',
                  'views_count', 'seo_title', 'seo_description']
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class PublicPostDetailSerializer(serializers.ModelSerializer):
    """Public Post Detail Serializer"""
    category = PublicCategorySerializer(read_only=True)
    featured_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'category',
                  'featured_image', 'featured_image_url', 'is_featured',
                  'is_slider', 'is_breaking', 'publish_at', 'views_count',
                  'seo_title', 'seo_description', 'created_at']
    
    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class PublicPageSectionSerializer(serializers.ModelSerializer):
    """Public Page Section Serializer"""
    section_type_display = serializers.CharField(source='get_section_type_display', read_only=True)
    
    class Meta:
        model = PageSection
        fields = ['id', 'section_type', 'section_type_display', 'data', 'order']


class PublicPageSerializer(serializers.ModelSerializer):
    """Public Page Serializer with Sections"""
    sections = serializers.SerializerMethodField()
    
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'seo_title', 'seo_description', 'sections']
    
    def get_sections(self, obj):
        sections = obj.sections.filter(is_active=True).order_by('order')
        return PublicPageSectionSerializer(sections, many=True).data


class PublicMenuSerializer(serializers.ModelSerializer):
    """Public Menu Serializer"""
    menu_type_display = serializers.CharField(source='get_menu_type_display', read_only=True)
    url = serializers.SerializerMethodField()
    
    class Meta:
        model = Menu
        fields = ['id', 'title', 'menu_type', 'menu_type_display', 'url', 'order']
    
    def get_url(self, obj):
        return obj.get_url()


class HomepageSerializer(serializers.Serializer):
    """Homepage Serializer"""
    menus = PublicMenuSerializer(many=True)
    categories = PublicCategorySerializer(many=True)
    featured_posts = PublicPostListSerializer(many=True)
    slider_posts = PublicPostListSerializer(many=True)
    breaking_posts = PublicPostListSerializer(many=True)
    latest_posts = PublicPostListSerializer(many=True, required=False)
    homepage_page = PublicPageSerializer(required=False, allow_null=True)
