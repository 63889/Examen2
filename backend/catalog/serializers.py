from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        exclude = ['id']

    
    # def update(self, instance, validated_data):
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()
    #     return instance

    # def validate_digital_licenses_left (self, value):
    #     total = self.initial_data.get('total_digital_licenses', 0)
    #     if int(value) > int(total):
    #         raise serializers.ValidationError("Not enough licenses left.")
    #     return value
    
# class AuthorSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Author
#         exclude = ['id']
    
# class CategorySerializer(serializers.ModelSerializer):
#     class Meta: 
#         model = Category
#         exclude = ['id']
    
# class ReviewSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Review
#         fields = '__all__'