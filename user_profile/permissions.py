from rest_framework.permissions import BasePermission


class IsUser(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.pk == request.user.pk


class IsParent(BasePermission):
    """
     Permission class to check if the current user is a parent based on the parent's ID from the URL.
    """
    def has_permission(self, request, view):
        user_pk_from_url = view.kwargs.get('user_pk')
        return request.user.pk == user_pk_from_url


class IsChildBelongingToParent(BasePermission):
    """
    Custom permission to check if the child belongs to the parent.
    """
    def has_object_permission(self, request, view, obj):
        return obj.parent == request.user
