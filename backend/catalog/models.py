from django.db import models
from django.conf import settings

class ActiveBookManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_active = True)

class Book(models.Model):
    isbn = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    pub_date = models.TextField(blank=True, null=True)
    page_count = models.IntegerField(blank=True, null=True)
    thumbnail = models.URLField(blank=True, null=True)
    # total_digital_licenses = models.IntegerField(default=0)
    # digital_licenses_left = models.IntegerField(default=0)
    search_info = models.TextField(blank=True, null=True)

    authors = models.JSONField(default=list)
    categories = models.JSONField(default=list)
    reviews = models.JSONField(default=list)
    
    is_active = models.BooleanField(default=True)

    objects = ActiveBookManager()
    all_objects = models.Manager()

    class Meta:
        app_label = 'catalog'

    def __str__(self):
        return self.title


# class Author(models.Model):
#     full_name = models.CharField(max_length=255, blank=True)
#     bio = models.TextField(blank=True)
#     photo = models.URLField(blank=True)

#     class Meta:
#         app_label = 'catalog'

# class Category(models.Model):
#     category = models.CharField(max_length=120, unique=True)
#     description = models.TextField(blank=True)

#     class Meta: 
#         app_label = 'catalog'

# class Review(models.Model):
#     user_name = models.CharField(max_length=255)
#     explanation = models.TextField(blank=True)
#     stars = models.IntegerField(blank=True, null=True)

#     class Meta: 
#         app_label = 'catalog'

