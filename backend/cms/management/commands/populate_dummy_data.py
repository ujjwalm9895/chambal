"""
Django Management Command to Populate Database with Dummy Data
Usage: python manage.py populate_dummy_data
"""

import sys
import io

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from cms.models import Category, Post, Menu, Page, PageSection
from datetime import timedelta
import random

User = get_user_model()


class Command(BaseCommand):
    help = 'Populates the database with dummy data for testing'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing dummy data before populating',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing existing data...'))
            Post.objects.all().delete()
            PageSection.objects.all().delete()
            Page.objects.all().delete()
            Menu.objects.all().delete()
            Category.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Existing data cleared!'))

        self.stdout.write(self.style.SUCCESS('Starting to populate dummy data...'))

        # Create or get admin user
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@chambalsandesh.com',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin123')
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created admin user: {admin_user.username}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Using existing admin user: {admin_user.username}'))

        # Create or get editor user
        editor_user, created = User.objects.get_or_create(
            username='editor1',
            defaults={
                'email': 'editor@chambalsandesh.com',
                'first_name': 'Editor',
                'last_name': 'One',
                'role': 'editor',
                'is_staff': False,
                'is_superuser': False,
            }
        )
        if created:
            editor_user.set_password('editor123')
            editor_user.save()
            self.stdout.write(self.style.SUCCESS(f'Created editor user: {editor_user.username}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Using existing editor user: {editor_user.username}'))

        # Create Categories
        self.stdout.write(self.style.SUCCESS('Creating categories...'))
        categories_data = [
            # English Categories
            {'name': 'News', 'language': 'en', 'show_in_menu': True, 'menu_order': 1},
            {'name': 'Sports', 'language': 'en', 'show_in_menu': True, 'menu_order': 2},
            {'name': 'Entertainment', 'language': 'en', 'show_in_menu': True, 'menu_order': 3},
            {'name': 'Technology', 'language': 'en', 'show_in_menu': True, 'menu_order': 4},
            {'name': 'Business', 'language': 'en', 'show_in_menu': True, 'menu_order': 5},
            {'name': 'Health', 'language': 'en', 'show_in_menu': True, 'menu_order': 6},
            
            # Hindi Categories
            {'name': 'समाचार', 'language': 'hi', 'show_in_menu': True, 'menu_order': 1},
            {'name': 'खेल', 'language': 'hi', 'show_in_menu': True, 'menu_order': 2},
            {'name': 'मनोरंजन', 'language': 'hi', 'show_in_menu': True, 'menu_order': 3},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                language=cat_data['language'],
                defaults={
                    'show_in_menu': cat_data['show_in_menu'],
                    'menu_order': cat_data['menu_order'],
                    'is_active': True,
                }
            )
            categories[f"{cat_data['name']}_{cat_data['language']}"] = category
            if created:
                try:
                    self.stdout.write(self.style.SUCCESS(f'  Created category: {category.name} ({category.language})'))
                except UnicodeEncodeError:
                    self.stdout.write(self.style.SUCCESS(f'  Created category: {category.id} ({category.language})'))
            else:
                try:
                    self.stdout.write(self.style.SUCCESS(f'  Using existing category: {category.name} ({category.language})'))
                except UnicodeEncodeError:
                    self.stdout.write(self.style.SUCCESS(f'  Using existing category: {category.id} ({category.language})'))

        # Create Posts
        self.stdout.write(self.style.SUCCESS('Creating posts...'))
        
        post_titles_en = [
            "Breaking: Major Political Development in Chambal Region",
            "Local Cricket Team Wins Championship",
            "New Technology Initiative Launched in Schools",
            "Entertainment Industry Celebrates Regional Talent",
            "Business Leaders Meet to Discuss Economic Growth",
            "Health Department Announces New Vaccination Drive",
            "Weather Update: Heavy Rains Expected This Week",
            "Education Ministry Introduces New Curriculum",
            "Agriculture Sector Sees Record Production",
            "Tourism Board Promotes Local Heritage Sites",
            "Transportation System Gets Major Upgrade",
            "Local Artists Showcase Their Work",
            "Sports Complex Inauguration Ceremony",
            "Tech Startups Receive Funding",
            "Healthcare Facilities Expanded",
        ]

        post_titles_hi = [
            "चंबल क्षेत्र में प्रमुख राजनीतिक घटनाक्रम",
            "स्थानीय क्रिकेट टीम ने जीता चैम्पियनशिप",
            "स्कूलों में नई प्रौद्योगिकी पहल शुरू",
            "मनोरंजन उद्योग क्षेत्रीय प्रतिभा का जश्न मनाता है",
            "आर्थिक विकास पर चर्चा के लिए व्यापारिक नेताओं की बैठक",
        ]

        post_contents_en = [
            "This is a detailed news article about the latest developments. The content covers various aspects of the topic and provides comprehensive information to the readers.",
            "In a significant development, local authorities have announced new initiatives that will benefit the community. This marks an important milestone in regional progress.",
            "The event attracted participants from various backgrounds, highlighting the diversity and unity of the region. Organizers expressed satisfaction with the turnout.",
        ]

        post_contents_hi = [
            "यह नवीनतम घटनाक्रमों के बारे में एक विस्तृत समाचार लेख है। सामग्री विषय के विभिन्न पहलुओं को कवर करती है और पाठकों को व्यापक जानकारी प्रदान करती है।",
            "एक महत्वपूर्ण विकास में, स्थानीय अधिकारियों ने नई पहलों की घोषणा की है जो समुदाय को लाभान्वित करेगी। यह क्षेत्रीय प्रगति में एक महत्वपूर्ण मील का पत्थर है।",
        ]

        statuses = ['draft', 'pending', 'published', 'scheduled']
        en_categories = [c for key, c in categories.items() if c.language == 'en']
        hi_categories = [c for key, c in categories.items() if c.language == 'hi']

        # Create English posts
        for i, title in enumerate(post_titles_en):
            category = random.choice(en_categories) if en_categories else None
            status = statuses[i % len(statuses)]
            
            # Determine publish date based on status
            if status == 'published':
                publish_at = timezone.now() - timedelta(days=random.randint(1, 30))
            elif status == 'scheduled':
                publish_at = timezone.now() + timedelta(days=random.randint(1, 7))
            else:
                publish_at = None

            # Ensure seo_title doesn't exceed 70 characters
            seo_title_base = title[:50]  # Leave room for " - Chambal Sandesh" (18 chars)
            seo_title = f"{seo_title_base} - Chambal Sandesh"[:70]
            
            # Ensure seo_description doesn't exceed 160 characters
            seo_desc_base = f"Read about {title[:100]} and stay updated with latest news from Chambal region."
            seo_description = seo_desc_base[:160]
            
            post = Post.objects.create(
                title=title,
                content=random.choice(post_contents_en) + f"\n\n[Post #{i+1}] Additional details about this topic are covered in this section. The article provides insights and analysis.",
                excerpt=f"Brief excerpt for {title[:50]}...",
                category=category,
                author=admin_user if i % 2 == 0 else editor_user,
                language='en',
                status=status,
                is_featured=(i % 3 == 0),
                is_slider=(i % 4 == 0),
                is_breaking=(i % 5 == 0),
                is_recommended=(i % 6 == 0),
                publish_at=publish_at,
                seo_title=seo_title,
                seo_description=seo_description,
                views_count=random.randint(0, 1000),
            )
            self.stdout.write(self.style.SUCCESS(f'  Created post: {post.title} (Status: {status})'))

        # Create Hindi posts
        for i, title in enumerate(post_titles_hi):
            category = random.choice(hi_categories) if hi_categories else None
            status = 'published'
            publish_at = timezone.now() - timedelta(days=random.randint(1, 15))

            # Ensure seo_title doesn't exceed 70 characters
            seo_title_base = title[:50]  # Leave room for " - चंबल संदेश" 
            seo_title = f"{seo_title_base} - चंबल संदेश"[:70]
            
            # Ensure seo_description doesn't exceed 160 characters
            seo_desc_base = f"{title} के बारे में पढ़ें और चंबल क्षेत्र की नवीनतम खबरों से अपडेट रहें।"
            seo_description = seo_desc_base[:160]
            
            # Generate unique slug for Hindi posts (slugify might return empty for Hindi)
            base_slug = slugify(title)
            if not base_slug:
                base_slug = f"hindi-post-{i+1}"
            
            # Ensure slug is unique
            slug = base_slug
            counter = 1
            while Post.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            post = Post.objects.create(
                title=title,
                slug=slug,
                content=random.choice(post_contents_hi) + f"\n\n[लेख #{i+1}] इस विषय के बारे में अतिरिक्त विवरण इस खंड में शामिल हैं।",
                excerpt=f"{title[:50]} के लिए संक्षिप्त अंश...",
                category=category,
                author=admin_user,
                language='hi',
                status=status,
                is_featured=(i % 2 == 0),
                is_slider=(i % 3 == 0),
                publish_at=publish_at,
                seo_title=seo_title,
                seo_description=seo_description,
                views_count=random.randint(0, 500),
            )
            self.stdout.write(self.style.SUCCESS(f'  Created post: {post.title} (Status: {status})'))

        # Create Menus
        self.stdout.write(self.style.SUCCESS('Creating menus...'))
        
        # Navbar menus
        navbar_menus = [
            {'title': 'News', 'menu_type': 'navbar', 'link_type': 'category', 
             'category': categories.get('News_en'), 'order': 1},
            {'title': 'Sports', 'menu_type': 'navbar', 'link_type': 'category',
             'category': categories.get('Sports_en'), 'order': 2},
            {'title': 'Entertainment', 'menu_type': 'navbar', 'link_type': 'category',
             'category': categories.get('Entertainment_en'), 'order': 3},
            {'title': 'Technology', 'menu_type': 'navbar', 'link_type': 'category',
             'category': categories.get('Technology_en'), 'order': 4},
        ]

        # Footer menus
        footer_menus = [
            {'title': 'About Us', 'menu_type': 'footer', 'link_type': 'page', 'order': 1},
            {'title': 'Contact', 'menu_type': 'footer', 'link_type': 'url',
             'external_url': 'https://example.com/contact', 'order': 2},
            {'title': 'Privacy Policy', 'menu_type': 'footer', 'link_type': 'page', 'order': 3},
        ]

        # Create navbar menus
        for menu_data in navbar_menus:
            if menu_data['category']:
                menu, created = Menu.objects.get_or_create(
                    title=menu_data['title'],
                    menu_type=menu_data['menu_type'],
                    defaults={
                        'link_type': menu_data['link_type'],
                        'category': menu_data['category'],
                        'order': menu_data['order'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'  Created navbar menu: {menu.title}'))

        # Create footer menus (we'll link to pages after creating them)
        for menu_data in footer_menus:
            if menu_data['link_type'] == 'url':
                menu, created = Menu.objects.get_or_create(
                    title=menu_data['title'],
                    menu_type=menu_data['menu_type'],
                    defaults={
                        'link_type': menu_data['link_type'],
                        'external_url': menu_data['external_url'],
                        'order': menu_data['order'],
                        'is_active': True,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'  Created footer menu: {menu.title}'))

        # Create Pages
        self.stdout.write(self.style.SUCCESS('Creating pages...'))
        
        pages_data = [
            {
                'title': 'About Us',
                'slug': 'about-us',
                'seo_title': 'About Us - Chambal Sandesh',
                'seo_description': 'Learn more about Chambal Sandesh, your trusted source for local news and updates.',
            },
            {
                'title': 'Privacy Policy',
                'slug': 'privacy-policy',
                'seo_title': 'Privacy Policy - Chambal Sandesh',
                'seo_description': 'Read our privacy policy to understand how we collect, use, and protect your information.',
            },
            {
                'title': 'Home',
                'slug': 'home',
                'seo_title': 'Home - Chambal Sandesh',
                'seo_description': 'Welcome to Chambal Sandesh - Your trusted news source.',
            },
        ]

        pages_dict = {}
        for page_data in pages_data:
            page, created = Page.objects.get_or_create(
                slug=page_data['slug'],
                defaults={
                    'title': page_data['title'],
                    'seo_title': page_data['seo_title'],
                    'seo_description': page_data['seo_description'],
                    'is_active': True,
                }
            )
            pages_dict[page_data['slug']] = page
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created page: {page.title}'))

        # Link footer menus to pages
        about_page = pages_dict.get('about-us')
        privacy_page = pages_dict.get('privacy-policy')
        
        if about_page:
            Menu.objects.filter(title='About Us', menu_type='footer').update(page=about_page, link_type='page')
        if privacy_page:
            Menu.objects.filter(title='Privacy Policy', menu_type='footer').update(page=privacy_page, link_type='page')

        # Create Homepage Sections
        self.stdout.write(self.style.SUCCESS('Creating homepage sections...'))
        
        homepage = pages_dict.get('home')
        if homepage:
            # Hero Section
            PageSection.objects.get_or_create(
                page=homepage,
                section_type='hero',
                defaults={
                    'data': {
                        'title': 'Welcome to Chambal Sandesh',
                        'subtitle': 'Your trusted source for latest news and updates from the Chambal region',
                        'cta_text': 'Read Latest News',
                        'cta_link': '/articles',
                    },
                    'order': 1,
                    'is_active': True,
                }
            )
            self.stdout.write(self.style.SUCCESS('  Created Hero section'))

            # Article List Section
            PageSection.objects.get_or_create(
                page=homepage,
                section_type='article_list',
                defaults={
                    'data': {
                        'title': 'Latest News',
                        'category': 'news',
                        'limit': 6,
                        'featured': False,
                    },
                    'order': 2,
                    'is_active': True,
                }
            )
            self.stdout.write(self.style.SUCCESS('  Created Article List section'))

            # Slider Section
            PageSection.objects.get_or_create(
                page=homepage,
                section_type='article_list',
                defaults={
                    'data': {
                        'title': 'Featured Stories',
                        'limit': 5,
                        'featured': True,
                    },
                    'order': 3,
                    'is_active': True,
                }
            )
            self.stdout.write(self.style.SUCCESS('  Created Featured Stories section'))

        self.stdout.write(self.style.SUCCESS('\n✅ Dummy data population completed successfully!'))
        self.stdout.write(self.style.SUCCESS(f'\n📊 Summary:'))
        self.stdout.write(self.style.SUCCESS(f'   - Users: {User.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Categories: {Category.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Posts: {Post.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Menus: {Menu.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Pages: {Page.objects.count()}'))
        self.stdout.write(self.style.SUCCESS(f'   - Page Sections: {PageSection.objects.count()}'))
        
        self.stdout.write(self.style.SUCCESS(f'\n🔑 Login Credentials:'))
        self.stdout.write(self.style.SUCCESS(f'   - Admin: username=admin, password=admin123'))
        self.stdout.write(self.style.SUCCESS(f'   - Editor: username=editor1, password=editor123'))
