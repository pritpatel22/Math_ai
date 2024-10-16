from mongoengine import DoesNotExist
from .models import User  # Ensure this is your MongoDB User model

class UsernameOrEmailBackend:
    def authenticate(self, request, username_or_email=None, password=None, is_google_signin=False, **kwargs):
        if username_or_email is None:
            return None

        if is_google_signin:
            # Google sign-in: authenticate by email only
            try:
                user = User.objects.get(email=username_or_email)
                return user
            except DoesNotExist:
                return None
        else:
            # Manual sign-in: authenticate by username/email and password
            try:
                if '@' in username_or_email and '.' in username_or_email:
                    # Authenticate by email
                    user = User.objects.get(email=username_or_email)
                else:
                    # Authenticate by username
                    user = User.objects.get(username=username_or_email)
                
                # Verify the password
                if user.check_password(password):  # Assuming you have a method to check password
                    return user
                return None
            except DoesNotExist:
                return None
