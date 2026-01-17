from django.core.management.base import BaseCommand
from django.utils import timezone
from cms.models import Post


class Command(BaseCommand):
    help = 'Publish all posts that are not already published'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force publish even if status is already published',
        )

    def handle(self, *args, **options):
        if options['force']:
            # Update all posts to published with valid publish_at
            posts = Post.objects.all()
            updated = posts.update(
                status='published',
                publish_at=timezone.now()
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully published {updated} posts')
            )
        else:
            # Only update posts that are not published
            posts = Post.objects.exclude(status='published')
            
            updated_count = 0
            for post in posts:
                post.status = 'published'
                if not post.publish_at:
                    post.publish_at = timezone.now()
                post.save()
                updated_count += 1
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully published {updated_count} posts')
            )
        
        # Show summary
        total = Post.objects.count()
        published = Post.objects.filter(
            status='published',
            publish_at__lte=timezone.now()
        ).count()
        
        self.stdout.write(self.style.SUCCESS(
            f'\nSummary:\n'
            f'  Total posts: {total}\n'
            f'  Published posts (visible on website): {published}'
        ))
