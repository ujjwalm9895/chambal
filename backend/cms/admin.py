from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Category, Menu, Page, PageSection, Post, SiteSettings


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'language', 'show_in_menu', 'menu_order', 'is_active', 'created_at']
    list_filter = ['language', 'show_in_menu', 'is_active', 'created_at']
    search_fields = ['name', 'slug']
    list_editable = ['show_in_menu', 'menu_order', 'is_active']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['menu_order', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'language')
        }),
        ('Menu Settings', {
            'fields': ('show_in_menu', 'menu_order')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


class PageSectionInline(admin.TabularInline):
    """Inline editor for Page Sections"""
    model = PageSection
    extra = 1
    fields = ('section_type', 'data', 'order', 'is_active')
    ordering = ('order',)
    
    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)
        # Customize formset if needed
        return formset


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'is_active', 'section_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'slug', 'seo_title']
    prepopulated_fields = {'slug': ('title',)}
    inlines = [PageSectionInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug')
        }),
        ('SEO Settings', {
            'fields': ('seo_title', 'seo_description'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    def section_count(self, obj):
        """Display number of sections"""
        count = obj.sections.count()
        return format_html(
            '<a href="{}">{}</a>',
            reverse('admin:cms_pagesection_changelist') + f'?page__id__exact={obj.id}',
            f'{count} section{"s" if count != 1 else ""}'
        )
    section_count.short_description = 'Sections'


@admin.register(PageSection)
class PageSectionAdmin(admin.ModelAdmin):
    list_display = ['page', 'section_type', 'order', 'is_active', 'created_at']
    list_filter = ['section_type', 'is_active', 'created_at', 'page']
    search_fields = ['page__title']
    list_editable = ['order', 'is_active']
    ordering = ['page', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('page', 'section_type')
        }),
        ('Content Data', {
            'fields': ('data',),
            'description': 'Enter JSON data based on section type. Example for article_list: {"title": "Latest News", "limit": 5, "category": 1}'
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'status', 'is_featured', 'is_slider', 'is_breaking', 'publish_at', 'views_count']
    list_filter = ['status', 'category', 'is_featured', 'is_slider', 'is_breaking', 'publish_at', 'created_at']
    search_fields = ['title', 'slug', 'content', 'seo_title']
    list_editable = ['status', 'is_featured', 'is_slider']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['views_count', 'created_at', 'updated_at']
    date_hierarchy = 'publish_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'category')
        }),
        ('Content', {
            'fields': ('content', 'featured_image')
        }),
        ('Publishing', {
            'fields': ('status', 'publish_at', 'is_featured', 'is_slider', 'is_breaking', 'is_recommended')
        }),
        ('SEO Settings', {
            'fields': ('seo_title', 'seo_description'),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('views_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Auto-set published_at when status changes to published
        if obj.status == 'published' and not obj.publish_at:
            from django.utils import timezone
            obj.publish_at = timezone.now()
        super().save_model(request, obj, form, change)


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ['title', 'menu_type', 'link_type', 'get_link_target', 'order', 'is_active']
    list_filter = ['menu_type', 'link_type', 'is_active', 'created_at']
    search_fields = ['title']
    list_editable = ['order', 'is_active']
    ordering = ['menu_type', 'order']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'menu_type', 'link_type')
        }),
        ('Link Configuration', {
            'fields': ('category', 'page', 'external_url'),
            'description': 'Select the appropriate link target based on link_type'
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def get_link_target(self, obj):
        """Display what the menu item links to"""
        if obj.link_type == 'category' and obj.category:
            return format_html('<a href="{}">{}</a>', 
                             reverse('admin:cms_category_change', args=[obj.category.pk]),
                             obj.category.name)
        elif obj.link_type == 'page' and obj.page:
            return format_html('<a href="{}">{}</a>',
                             reverse('admin:cms_page_change', args=[obj.page.pk]),
                             obj.page.title)
        elif obj.link_type == 'url' and obj.external_url:
            return format_html('<a href="{}" target="_blank">{}</a>', 
                             obj.external_url, obj.external_url[:50])
        return '-'
    get_link_target.short_description = 'Links To'
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # You can customize form fields visibility based on link_type here
        return form


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    """Site Settings Admin - Singleton"""
    
    def has_add_permission(self, request):
        # Only allow one settings instance
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of settings
        return False
    
    fieldsets = (
        ('Site Information', {
            'fields': ('site_name', 'site_tagline', 'site_logo', 'site_favicon')
        }),
        ('Contact Information', {
            'fields': ('contact_email', 'contact_phone', 'contact_address')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'twitter_url', 'instagram_url', 'youtube_url', 'linkedin_url')
        }),
        ('SEO Defaults', {
            'fields': ('default_seo_title', 'default_seo_description', 'default_seo_keywords'),
            'classes': ('collapse',)
        }),
        ('General Settings', {
            'fields': ('posts_per_page', 'enable_comments', 'enable_registration')
        }),
        ('Maintenance Mode', {
            'fields': ('maintenance_mode', 'maintenance_message'),
            'classes': ('collapse',)
        }),
        ('Analytics', {
            'fields': ('google_analytics_id', 'facebook_pixel_id'),
            'classes': ('collapse',)
        }),
    )


# Customize Admin Site Header
admin.site.site_header = "Chambal Sandesh CMS"
admin.site.site_title = "Chambal Sandesh Admin"
admin.site.index_title = "Content Management System"
