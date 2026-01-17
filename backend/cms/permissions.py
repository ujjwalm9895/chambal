from rest_framework import permissions


class IsAdminOrEditor(permissions.BasePermission):
    """Allow access only to admin or editor roles, or superusers"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Superusers and staff always have access
        if getattr(request.user, 'is_superuser', False) or getattr(request.user, 'is_staff', False):
            return True
        return request.user.role in ['admin', 'editor']


class IsAdmin(permissions.BasePermission):
    """Allow access only to admin role, or superusers"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Superusers and staff always have access
        if getattr(request.user, 'is_superuser', False) or getattr(request.user, 'is_staff', False):
            return True
        return request.user.role == 'admin'


class IsOwnerOrEditor(permissions.BasePermission):
    """Allow access to owner, editor, or admin, or superusers"""
    
    def has_object_permission(self, request, view, obj):
        # Superusers and staff always have access
        if getattr(request.user, 'is_superuser', False) or getattr(request.user, 'is_staff', False):
            return True
        
        # Admin and editor can access all
        if request.user.role in ['admin', 'editor']:
            return True
        
        # Writer can only access their own posts
        if hasattr(obj, 'author'):
            return obj.author == request.user
        
        return False


class IsWriterOrAbove(permissions.BasePermission):
    """Allow access to writer, editor, or admin, or superusers"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Superusers and staff always have access
        if getattr(request.user, 'is_superuser', False) or getattr(request.user, 'is_staff', False):
            return True
        return request.user.role in ['admin', 'editor', 'writer']
