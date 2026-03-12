from django.urls import path
from .views import add_book, get_all_books, fetch_google_books, deactivate_book, update_book, add_favorite, get_favorite_books, remove_favorite

urlpatterns = [
    path("add_book/", add_book, name="add_book"),
    path("get_all_books/", get_all_books, name="get_all_books"),
    path("fetch_google_books/", fetch_google_books, name="fetch_google_books"),
    path("deactivate_book/", deactivate_book, name="deactivate_book"),
    path("update_book/", update_book, name="update_book"),
    path("add_favorite_book/", add_favorite, name="add_favorite"),
    path("get_favorite_books/", get_favorite_books, name="get_favorite_books"),
    path("remove_favorite_book/", remove_favorite, name="remove_favorite")
]