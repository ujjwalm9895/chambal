#!/usr/bin/env python
"""
Test script to verify all API endpoints and data
"""

import os
import sys
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.insert(0, 'd:\\chambal\\backend')
django.setup()

from cms.models import Post, Category
from cms.public_serializers import PublicPostListSerializer, PublicPostDetailSerializer
from django.utils import timezone
from django.test import RequestFactory

def test_post_data():
    """Test post data and serializer output"""
    print("\n" + "="*60)
    print("TESTING POST DATA AND SERIALIZERS")
    print("="*60)
    
    # Get a published post
    post = Post.objects.filter(status='published', publish_at__lte=timezone.now()).first()
    
    if not post:
        print("NO published posts found!")
        return
    
    print(f"\nFound post: {post.title}")
    print(f"   ID: {post.id}")
    print(f"   Slug: {post.slug}")
    print(f"   Status: {post.status}")
    print(f"   Category: {post.category}")
    print(f"   Featured Image: {post.featured_image}")
    print(f"   Has Image: {bool(post.featured_image)}")
    
    # Test serializer
    factory = RequestFactory()
    request = factory.get('/')
    
    print("\n--- PublicPostListSerializer Output ---")
    serializer = PublicPostListSerializer(post, context={'request': request})
    serialized_data = serializer.data
    print(json.dumps(serialized_data, indent=2, default=str))
    
    print("\n--- PublicPostDetailSerializer Output ---")
    detail_serializer = PublicPostDetailSerializer(post, context={'request': request})
    detail_data = detail_serializer.data
    print(json.dumps(detail_data, indent=2, default=str))
    

def test_multiple_posts():
    """Test multiple posts"""
    print("\n" + "="*60)
    print("TESTING MULTIPLE POSTS")
    print("="*60)
    
    posts = Post.objects.filter(
        status='published',
        publish_at__lte=timezone.now()
    ).select_related('category')[:5]
    
    factory = RequestFactory()
    request = factory.get('/')
    
    serializer = PublicPostListSerializer(posts, many=True, context={'request': request})
    print(f"\nSerialized {len(posts)} posts:")
    print(json.dumps(serializer.data, indent=2, default=str))


def test_categories():
    """Test categories"""
    print("\n" + "="*60)
    print("TESTING CATEGORIES")
    print("="*60)
    
    categories = Category.objects.filter(is_active=True)[:5]
    print(f"\nFound {len(categories)} active categories:")
    for cat in categories:
        posts_count = cat.posts.filter(status='published').count()
        print(f"   - {cat.name} (slug: {cat.slug}, posts: {posts_count})")


if __name__ == '__main__':
    print("\n[DIAGNOSTIC TEST SUITE]")
    test_post_data()
    test_multiple_posts()
    test_categories()
    print("\n" + "="*60)
    print("[DIAGNOSTIC COMPLETE]")
    print("="*60)
