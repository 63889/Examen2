from .serializers import UserSerializer, UserSerializerDTO, CustomTokenObtainPairSerializer, ProfilePictureUploadSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, Role, ProfilePicture


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        User.objects.create_user(
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    profile_picture, created = ProfilePicture.objects.get_or_create(user=user)
    user_serializer = UserSerializer(user, data=request.data, partial=True)
    profile_picture_serializer = ProfilePictureUploadSerializer(profile_picture, data=request.data, partial=True)

    if user_serializer.is_valid() and profile_picture_serializer.is_valid():
        try: 
            with transaction.atomic():
                user_serializer.save()
                profile_picture_serializer.save()
                serializer = UserSerializerDTO(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except  Exception as e:
            # return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            import traceback
            error_message = traceback.format_exc()
            return Response({"error": str(e), "traceback": error_message}, status=500)
    errors = {**user_serializer.errors, **profile_picture_serializer.errors}
    return Response(errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_me(request):
    serializer = UserSerializerDTO(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def greeting(request):
    return Response({"message": f"Hello {request.user.email}, you're in :)"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refreshToken = request.data["refresh"]
        token = RefreshToken(refreshToken)
        token.blacklist()
        return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)



# ONLY FOR ADMINS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_librarians(request):
    user = request.user
    if (user.is_admin):
        try:
            librarians = User.objects.filter(role=Role.LIB, is_active=True)
            serializer = UserSerializerDTO(librarians, many=True)
            response = Response(serializer.data, status = status.HTTP_200_OK)
        except:
            response = Response(status = status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            return response
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

# TO TEST
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_librarian_password(request):
    user = request.user
    if user.is_admin:
        user_email = request.data.get('email')
        user_to_update = get_object_or_404(User, id=user_email, role=Role.LIB, is_active=True)
        new_password = request.data.get('password')
        if not new_password or len(new_password) < 8:
            return Response({"error": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST)
            
        user_to_update.set_password(new_password)
        user_to_update.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_librarian(request):
    user = request.user
    if user.is_admin:
        user_email = request.data.get('email')
        user_to_update = get_object_or_404(User, email=user_email, role=Role.LIB)
        serializer = UserSerializerDTO(user_to_update, request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

# TODO
# POST LIB
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_librarian(request):
    user = request.user
    if user.is_admin:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            new_librarian = User.objects.create_user(
                email=data.get('email'),
                password=data.get('password'),
                role=Role.LIB,
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
            )
            serializer_dto = UserSerializerDTO(new_librarian)
            return Response(serializer_dto.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def delete_librarian(request):
    user = request.user 
    if user.is_admin:
        user_email = request.data.get('email')
        user_to_delete = get_object_or_404(User, email=user_email, role=Role.LIB, is_active=True)
        user_to_delete.is_active = False
        user_to_delete.save()
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)
# def login(request):
#     if request.method == 'POST':
#         username = request.data.get('username')
#         password = request.data.get('password')
#         user = authenticate(username=username, password=password)
#         if user is not None:
#             serializer = UserSerializer(user)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
#     return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

# class UserList(APIView):
#     """
#     List all users or create a new user.
#     """
#     def get(self, request):
#         users = User.objects.all()
#         serializer = UserSerializer(users, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)