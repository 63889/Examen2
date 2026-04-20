import os
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.conf import settings

# Create your models here.
class Role(models.TextChoices):
    ADMIN = "ADMIN", 'Admin' # Just for librarians management
    LIB = "LIB", 'lib' # Librarian
    USER = "USER", 'User' # Normal user

class UserManager(BaseUserManager):
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(email, password, Role.ADMIN, **extra_fields)
    
    def create_user(self, email, password, role=Role.USER, **extra_fields):
        if not email:
            raise ValueError('An email must be set')
        if not password:
            raise ValueError('A password must be provided')
        
        required_fields = ['first_name', 'last_name']

        for field in required_fields:
            if not extra_fields.get(field):
                raise ValueError(f"Field {field.replace("_", " ")} is required")
            
        email = self.normalize_email(email)
        user = self.model(email=email, role=role, **extra_fields)
        user.set_password(password)
        user.save()
        return user

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(choices=Role.choices)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email
    
    
    @property
    def get_profile_picture(self):
        if hasattr(self, 'profile_picture') and self.profile_picture:
            return self.profile_picture.get_full_url
        return "http://192.168.1.7:8080/images/default.jpg"
    
    @property
    def is_admin(self):
        return self.role == Role.ADMIN
    
    @property
    def is_librarian(self):
        return self.role == Role.LIB
    
    @property
    def is_user(self):
        return self.role == Role.USER

class ProfilePicture(models.Model):
    image_uri = models.URLField(blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile_picture')
    
    def update_image(self, uploaded_file):
        filename = f"user-{self.user.id}-{uploaded_file.name}"
        file_path = os.path.join(settings.MEDIA_ROOT, 'profiles', filename)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        
        self.image_uri  =  f"profiles/{filename}"
        self.save()
        # os.chmod(file_path, 0o644)
    
    @property
    def get_full_url(self):
        if self.image_uri:
            return f"http://192.168.1.7:8080/images/{self.image_uri}"
        return "http://192.168.1.7:8080/images/default.jpg"
    