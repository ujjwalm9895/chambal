from django.db import models
from django.urls import reverse
from django.utils.text import slugify
from django.core.validators import MinValueValidator


class Category(models.Model):
    """Category Model - Supports Hindi and English"""
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, blank=True)  # unique_together handles uniqueness per language
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    show_in_menu = models.BooleanField(default=True)
    menu_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['menu_order', 'name']
        unique_together = [['slug', 'language']]
    
    def __str__(self):
        return f"{self.name} ({self.get_language_display()})"
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            self.slug = base_slug
            
            # Ensure slug uniqueness per language
            # If slug exists for this language, append a number
            if self.pk:
                # Updating existing category
                existing = Category.objects.filter(slug=self.slug, language=self.language).exclude(pk=self.pk)
            else:
                # Creating new category
                existing = Category.objects.filter(slug=self.slug, language=self.language)
            
            if existing.exists():
                counter = 1
                while Category.objects.filter(slug=f"{base_slug}-{counter}", language=self.language).exists():
                    counter += 1
                self.slug = f"{base_slug}-{counter}"
        
        super().save(*args, **kwargs)


class Page(models.Model):
    """Static/Custom Pages Model"""
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    seo_title = models.CharField(max_length=70, blank=True, null=True)
    seo_description = models.TextField(max_length=160, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['title']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class PageSection(models.Model):
    """Dynamic Page Sections - Key Feature for Flexible Layouts"""
    SECTION_TYPES = [
        ('hero', 'Hero Section'),
        ('slider', 'Slider'),
        ('article_list', 'Article List'),
        ('banner', 'Banner'),
        ('html', 'HTML Content'),
    ]
    
    page = models.ForeignKey(Page, on_delete=models.CASCADE, related_name='sections')
    section_type = models.CharField(max_length=20, choices=SECTION_TYPES)
    data = models.JSONField(default=dict, help_text="Section-specific data in JSON format")
    order = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Page Section'
        verbose_name_plural = 'Page Sections'
    
    def __str__(self):
        return f"{self.page.title} - {self.get_section_type_display()} ({self.order})"


class Post(models.Model):
    """Post Model for News Content - Enhanced with Workflow"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('pending', 'Pending Review'),
        ('scheduled', 'Scheduled'),
        ('published', 'Published'),
    ]
    
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('hi', 'Hindi'),
    ]
    
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField(help_text="Rich text content")
    excerpt = models.TextField(max_length=500, blank=True, null=True)
    featured_image = models.ImageField(upload_to='posts/', blank=True, null=True)
    video = models.FileField(upload_to='posts/videos/', blank=True, null=True, help_text="Upload video file")
    video_url = models.URLField(blank=True, null=True, help_text="Or embed video from YouTube/Vimeo/etc.")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='posts')
    author = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, related_name='posts')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_featured = models.BooleanField(default=False)
    is_slider = models.BooleanField(default=False)
    is_breaking = models.BooleanField(default=False)
    is_recommended = models.BooleanField(default=False)
    publish_at = models.DateTimeField(null=True, blank=True, help_text="Schedule publish time")
    seo_title = models.CharField(max_length=70, blank=True, null=True)
    seo_description = models.TextField(max_length=160, blank=True, null=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-publish_at', '-created_at']
        indexes = [
            models.Index(fields=['status', 'publish_at']),
            models.Index(fields=['category', 'status']),
            models.Index(fields=['author', 'status']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_slider']),
            models.Index(fields=['is_breaking']),
            models.Index(fields=['language', 'status']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-set publish_at when status changes to published
        if self.status == 'published' and not self.publish_at:
            from django.utils import timezone
            self.publish_at = timezone.now()
        
        super().save(*args, **kwargs)
    
    @property
    def published_at(self):
        """Alias for publish_at for backward compatibility"""
        return self.publish_at if self.publish_at else self.created_at


class Menu(models.Model):
    """Dynamic Menu System - Navbar and Footer"""
    MENU_TYPES = [
        ('navbar', 'Navbar'),
        ('footer', 'Footer'),
    ]
    
    LINK_TYPES = [
        ('category', 'Category'),
        ('page', 'Page'),
        ('url', 'External URL'),
    ]
    
    title = models.CharField(max_length=200)
    menu_type = models.CharField(max_length=20, choices=MENU_TYPES)
    link_type = models.CharField(max_length=20, choices=LINK_TYPES)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True, related_name='menu_items')
    page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True, blank=True, related_name='menu_items')
    external_url = models.URLField(blank=True, null=True)
    order = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['menu_type', 'order', 'title']
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'
    
    def __str__(self):
        return f"{self.title} ({self.get_menu_type_display()})"
    
    def get_url(self):
        """Get the appropriate URL based on link_type"""
        if self.link_type == 'category' and self.category:
            return f"/category/{self.category.slug}/"
        elif self.link_type == 'page' and self.page:
            return f"/page/{self.page.slug}/"
        elif self.link_type == 'url' and self.external_url:
            return self.external_url
        return "#"


class SiteSettings(models.Model):
    """Site-wide settings (Singleton pattern)"""
    site_name = models.CharField(max_length=200, default='Chambal Sandesh', help_text="Site name/title")
    site_tagline = models.CharField(max_length=300, blank=True, null=True, help_text="Site tagline or description")
    site_logo = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Site logo image")
    site_favicon = models.ImageField(upload_to='settings/', blank=True, null=True, help_text="Site favicon")
    
    # Contact Information
    contact_email = models.EmailField(blank=True, null=True)
    contact_phone = models.CharField(max_length=20, blank=True, null=True)
    contact_address = models.TextField(blank=True, null=True)
    
    # Social Media Links
    facebook_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    instagram_url = models.URLField(blank=True, null=True)
    youtube_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    # SEO Defaults
    default_seo_title = models.CharField(max_length=70, blank=True, null=True, help_text="Default SEO title")
    default_seo_description = models.TextField(max_length=160, blank=True, null=True, help_text="Default SEO description")
    default_seo_keywords = models.CharField(max_length=200, blank=True, null=True, help_text="Default SEO keywords (comma-separated)")
    
    # General Settings
    posts_per_page = models.PositiveIntegerField(default=20, help_text="Number of posts per page")
    enable_comments = models.BooleanField(default=False, help_text="Enable comments on posts")
    enable_registration = models.BooleanField(default=False, help_text="Allow user registration")
    maintenance_mode = models.BooleanField(default=False, help_text="Enable maintenance mode")
    maintenance_message = models.TextField(blank=True, null=True, help_text="Message to show during maintenance")
    
    # Analytics
    google_analytics_id = models.CharField(max_length=50, blank=True, null=True, help_text="Google Analytics Tracking ID")
    facebook_pixel_id = models.CharField(max_length=50, blank=True, null=True, help_text="Facebook Pixel ID")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'
    
    def __str__(self):
        return f"Settings - {self.site_name}"
    
    def save(self, *args, **kwargs):
        """Ensure only one settings instance exists"""
        self.pk = 1  # Force ID to 1
        super().save(*args, **kwargs)
    
    @classmethod
    def get_settings(cls):
        """Get or create the single settings instance"""
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
