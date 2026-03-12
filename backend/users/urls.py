from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import CustomTokenObtainPairView, register_user, greeting, update_user, get_me, logout, get_all_librarians, update_librarian_password, update_librarian, post_librarian, delete_librarian


urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("update_user/", update_user, name="update_user"),
    path("greeting/", greeting, name="greeting"),
    path("register/", register_user, name="register"),
    path("get_me/", get_me, name="get_me"),
    path("logout/", logout, name="logout"),
    # Only admin urls
    path("get_all_librarians/", get_all_librarians, name="get_all_librarians"),
    path("update_librarian_password/", update_librarian_password, name="update_librarian_password"),
    path("update_librarian/", update_librarian, name="update_librarian"),
    path("post_librarian/", post_librarian, name="post_librarian"),
    path("delete_librarian/", delete_librarian, name="delete_librarian"),
]