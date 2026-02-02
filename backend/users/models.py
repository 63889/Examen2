from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Create your models here.
class Role(models.TextChoices):
    ADMIN = "ADMIN", 'Admin'
    USER = "USER", 'User'

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

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(choices=Role.choices)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = UserManager()

    def __str__(self):
        return self.email