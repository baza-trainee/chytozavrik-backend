from rest_framework.permissions import BasePermission
from user_profile.models import Child


class HasPermissionToViewChildRewards(BasePermission):
    """
    Custom permission to check if the child belongs to the parent.
    """

    def has_permission(self, request, view):
        child_id = view.kwargs.get("child_id")

        if child_id is None:
            return False

        try:
            child = Child.objects.get(pk=child_id)
        except Child.DoesNotExist:
            return False

        return child.parent == request.user
