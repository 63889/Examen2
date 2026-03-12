from django.db import models
from users.models import User
from datetime import date, timedelta 

def default_due_date():
    return date.today() + timedelta(days=5)

class BookLicense(models.Model):
    isbn                   = models.CharField(max_length=20, unique=True)  # bridge to MongoDB
    total_digital_licenses = models.IntegerField(default=0)
    digital_licenses_left  = models.IntegerField(default=0)
    updated_at             = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"License: {self.isbn}"

class BorrowedBooks(models.Model):
    STATUS_CHOICES = [
        ('active',    'Active'),
        ('returned',  'Returned'),
        ('overdue',   'Overdue'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='borrowed_books')
    book_license = models.ForeignKey(BookLicense, on_delete=models.PROTECT, to_field='isbn', related_name='borrowed_books')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField(default=default_due_date)
    returned_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-borrowed_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'book_license'],
                condition=models.Q(status='active'),
                name='unique_active_borrow'
        )
    ]

    def __str__(self):
        return f"{self.user} - {self.book_license.isbn} - {self.status}"

class FavoriteBook(models.Model):
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    isbn        = models.CharField(max_length=20)  
    added_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-added_at']
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'isbn'],
                name='unique_user_favorite'
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.isbn}"