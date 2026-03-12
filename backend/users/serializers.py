from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "password", "is_active"]

class UserSerializerDTO(serializers.ModelSerializer):
    profile_picture_url = serializers.ReadOnlyField(source='get_profile_picture')
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "role", "profile_picture_url"]

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if not self.user.is_active:
            raise AuthenticationFailed({"error":"You're account has been disabled, please reach an administrator if you think this is a mistake."})
        return data
    
class ProfilePictureUploadSerializer(serializers.Serializer):
    # This field doesn't exists on the models, it's just for the sake of the 
    # profile picture upload's functionality
    file = serializers.ImageField()

    def update(self, instance, validated_data):
        file = validated_data.get('file')
        if file:
            instance.update_image(file)
        return instance