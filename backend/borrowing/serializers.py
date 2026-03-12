from rest_framework import serializers
from .models import BookLicense, BorrowedBooks, FavoriteBook

class BookLicenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookLicense
        fields = ['isbn', 'total_digital_licenses', 'digital_licenses_left', 'updated_at']
        read_only_fields = ['digital_licenses_left', 'updated_at']
    
    def create(self, validated_data):
        # when creating, licenses_left = total_digital_licenses
        validated_data['digital_licenses_left'] = validated_data['total_digital_licenses']
        return super().create(validated_data)
    
    # def update(self, instance, digital_licenses, validated_data):
    #     from django.db import transaction
    #     from datetime import datetime
    #     with transaction.atomic():
    #         license = BookLicense.objects.select_for_update().get(isbn=instance.isbn)
    #         license.total_digital_licenses += digital_licenses
    #         license.digital_licenses_left += digital_licenses
    #         license.save()
    #         return license


class BorrowedBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model  = BorrowedBooks
        fields = ['id', 'user', 'book_license', 'status', 'borrowed_at', 'due_date', 'returned_at']
        read_only_fields = ['borrowed_at', 'status', 'returned_at']

    def validate(self, data):
        # check licenses are available before allowing a borrow
        license = data['book_license']
        if license.digital_licenses_left <= 0:
            raise serializers.ValidationError("No digital licenses available for this book.")
        return data

    def create(self, validated_data):
        from django.db import transaction
        with transaction.atomic():
            license = validated_data['book_license']
            # lock the row to prevent race conditions
            license = BookLicense.objects.select_for_update().get(isbn=license.isbn)
            license.digital_licenses_left -= 1
            license.save()
            return super().create(validated_data)

class FavoriteBooksSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteBook
        fields = '__all__'
        read_only_fields = ['added_at', 'user']

# class ReturnBookSerializer(serializers.ModelSerializer):
#     class Meta:
#         model  = BorrowedBooks
#         fields = ['status', 'returned_at']

#     def update(self, instance, validated_data):
#         from django.db import transaction
#         from datetime import datetime
#         with transaction.atomic():
#             license = BookLicense.objects.select_for_update().get(isbn=instance.book_license.isbn)
#             license.digital_licenses_left += 1
#             license.save()
#             instance.status = 'returned'
#             instance.returned_at = datetime.now()
#             instance.save()
#             return instance
    
