from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user, greeting, update_user, get_me


urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("update_user/", update_user, name="update_user"),
    path("greeting/", greeting, name="greeting"),
    path("register/", register_user, name="register"),
    path("get_me/", get_me, name="get_me")
]