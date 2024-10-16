from mongoengine import Document, StringField, BooleanField, DictField, EmailField, DateTimeField, ListField, ReferenceField, CASCADE
from mongoengine import signals,ValidationError
import random
import pytz
from django.utils.text import slugify
from passlib.hash import pbkdf2_sha256 # type: ignore
import datetime

IST = pytz.timezone('Asia/Kolkata')


class Course(Document):
    title = StringField(required=True, unique=True)
    description = StringField()
    created_at = DateTimeField(default=datetime.datetime.utcnow)
    updated_at = DateTimeField(default=datetime.datetime.utcnow)
    videos = ListField(ReferenceField('Video'))  # List of video references

    def __str__(self):
        return self.title
    def get_videos(self):
        return Video.objects.filter(course=self)



class Video(Document):
    course = ReferenceField('Course', reverse_delete_rule=CASCADE)
    video_data = DictField(required=True)
    created_at = DateTimeField(default=lambda: datetime.datetime.now(IST))
    updated_at = DateTimeField(default=lambda: datetime.datetime.now(IST))

    def __str__(self):
        # Access the title from the nested structure
        try:
            return f"Video(title={self.video_data['items'][0]['snippet']['title']})"
        except (KeyError, IndexError):
            return "Video(title=No Title)"

    def save(self, *args, **kwargs):
        self.updated_at = datetime.datetime.now(IST)
        super(Video, self).save(*args, **kwargs)



class User(Document):
    email = EmailField(required=True, unique=True)
    first_name = StringField(max_length=50, required=True)
    last_name = StringField(max_length=50)
    mobile_number = StringField(max_length=15)
    username = StringField(max_length=100, unique=True)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=False)
    is_google_signup = BooleanField(default=False)  # New field for Google signup
    password = StringField()
    
    def verify_password(self, raw_password):
        self.password = pbkdf2_sha256.hash(raw_password)

    def check_password(self, raw_password):
        return pbkdf2_sha256.verify(raw_password, self.password)

    def generate_unique_username(self, first_name):
        base_username = f"{slugify(first_name)}{random.randint(0, 999999)}"
        username = base_username
        num = 1
        while User.objects(username=username).first():
            username = f"{base_username}{num}"
            num += 1
        return username

    def __str__(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        if not document.username and document.first_name:
            document.username = document.generate_unique_username(document.first_name)
        
        # Conditionally require fields if not Google signup
        if not document.is_google_signup:
            if not document.password or not document.mobile_number or not document.last_name:
                raise ValidationError("Password, mobile number, and last name are required for non-Google signups.")

# Connect pre_save signal to User model
signals.pre_save.connect(User.pre_save, sender=User)
# PaymentStatus creation handler function
def create_payment_status(sender, document, **kwargs):
    # Create a PaymentStatus record when a new User is registered
    if not PaymentStatus.objects(user=document).first():
        PaymentStatus(user=document, status='pending').save()

# Connect the signal
signals.post_save.connect(create_payment_status, sender=User)




class Admin(Document):
    email = EmailField(required=True, unique=True)
    first_name = StringField(max_length=50, required=True)
    last_name = StringField(max_length=50, required=True)
    mobile_number = StringField(max_length=15, required=True)
    username = StringField(max_length=100, unique=True, required=True)
    is_active = BooleanField(default=True)
    is_admin = BooleanField(default=True)
    password = StringField(required=True)

    def check_password(self, raw_password):
        """Verify the provided password against the stored hashed password."""
        return pbkdf2_sha256.verify(raw_password, self.password)

    def set_password(self, raw_password):
        """Hash and set the password."""
        self.password = pbkdf2_sha256.hash(raw_password)

    def generate_unique_username(self):
        """Generate a unique username based on the first name."""
        base_username = f"{slugify(self.first_name)}{random.randint(0, 999999)}"
        username = base_username
        num = 1
        while Admin.objects(username=username).first():  # Check for existing username
            username = f"{base_username}{num}"
            num += 1
        self.username = username

    def __str__(self):
        return self.username

    @property
    def is_staff(self):
        return self.is_admin

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        """Generate username before saving if it does not exist."""
        if not document.username:
            document.generate_unique_username()
            

signals.pre_save.connect(Admin.pre_save, sender=Admin)


# --- UserProfile Model ---
class UserProfile(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    avatar = StringField(default='avatars/default_avatar.png')

    def __str__(self):
        return f"{self.user.username}'s profile"

# --- PaymentStatus Model ---
class PaymentStatus(Document):
    user = ReferenceField(User, reverse_delete_rule=CASCADE)
    status = StringField(max_length=20, default='pending')

    def __str__(self):
        return f'{self.user.username} - {self.status}'

# --- UserManager Logic (Custom User Creation) ---
class UserManager:
    @staticmethod
    def create_user(email, first_name, last_name, mobile_number, password=None):
        if not email:
            raise ValueError('Users must have an email address')
        if not password:
            raise ValueError('Users must have a password')

        # Normalize the email
        email = email.lower()

        # Create the user instance
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            mobile_number=mobile_number,
        )
        user.verify_password(password)  # Set hashed password
        user.username = user.generate_unique_username(first_name)  # Generate a unique username
        user.save()

        return user

    @staticmethod
    def create_superuser(email, first_name, last_name, mobile_number, password=None):
        user = UserManager.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            mobile_number=mobile_number,
            password=password
        )
        user.is_admin = True
        user.save()
        return user
