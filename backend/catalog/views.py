from django.shortcuts import render
from django.db import transaction
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .serializers import BookSerializer
from .models import Book
from .service import GoogleBooksService
from borrowing.serializers import BookLicenseSerializer, BookLicense, FavoriteBooksSerializer
from borrowing.models import FavoriteBook

# Create your views here.
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_book(request):
    user = request.user
    if user.is_librarian :
        try:
            with transaction.atomic():
                # 1. Validate the license 
                license_data = {
                    'isbn': request.data.get('isbn'),
                    'total_digital_licenses': request.data.get('total_digital_licenses', 1),
                }
                license_serializer = BookLicenseSerializer(data=license_data)
                if not license_serializer.is_valid():
                    return Response(license_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                # 2. Save the book to MongoDB
                book_serializer = BookSerializer(data=request.data)
                if not book_serializer.is_valid():
                    return Response(book_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                book_serializer.save()
                #3. Save the previously validated license
                license_serializer.save()
                #4. Return the new book
                return Response({
                    'book':    book_serializer.data,
                    'license': license_serializer.data
                }, status=status.HTTP_201_CREATED)
        except Exception as e:
            if 'book_serializer' in locals() and book_serializer.instance:
                book_serializer.instance.delete()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

#TODO update book view
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_book(request):
    user = request.user
    if user.is_librarian :
        isbn = request.data.get('isbn')
        if not isbn:
            return Response({'error': 'ISBN is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            book = Book.objects.get(isbn=isbn)
            serializer = BookSerializer(instance=book, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            Book.objects.filter(isbn = isbn).update(**serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_403_FORBIDDEN)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_Book(request):
#     user = request.user
#     if( user.is_librarian ):
#         serializer = BookSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         print("Serializer errors:", serializer.errors)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     return Response(status=status.HTTP_403_FORBIDDEN)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_author(request):
#     user = request.user
#     if ( user.is_librarian ):
#         serializer = AuthorSerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTPP_201_CREATED)
#         return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
#     return Response(status=status.HTTP_403_FORBIDDEN)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def add_category(request):
#     user = request.user
#     if ( user.is_librarian ):
#         serializer = CategorySerializer(data = request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTPP_201_CREATED)
#         return Response(serializer.error, status=status.HTTP_400_BAD_REQUEST)
#     return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_books(request):
    user = request.user
    if ( user.is_librarian or user.is_user ):
        books = Book.objects.all()
        serializer = BookSerializer(books, many=True)

        #fetch all licenses
        isbns = [book.isbn for book in books]
        licenses = BookLicense.objects.filter(isbn__in=isbns)
        license_map = {l.isbn: l.digital_licenses_left for l in licenses}

        #Merge licenses into book data
        data = serializer.data
        for book in data:
            book['digital_licenses_left'] = license_map.get(book['isbn'], 0)
        
        print(data)
        return Response(data, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_books(request):
    favorite_books = FavoriteBook.objects.filter(user = request.user)
    serializer = FavoriteBooksSerializer(favorite_books, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# POST — add a book to favorites
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    isbn = request.data.get('isbn')
    if not isbn:
        return Response({'error': 'ISBN is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # check book exists in MongoDB
        if not Book.objects.filter(isbn=isbn).exists():
            return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
        favorite, created = FavoriteBook.objects.get_or_create(
            user=request.user,
            isbn=isbn
        )
        if not created:
            return Response({'error': 'Book already in favorites.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = FavoriteBooksSerializer(favorite)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# DELETE — remove a book from favorites
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_favorite(request):
    isbn = request.data.get('isbn')
    if not isbn:
        return Response({'error': 'ISBN is required.'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        deleted, _ = FavoriteBook.objects.filter(
            user=request.user,
            isbn=isbn
        ).delete()
        if not deleted:
            return Response({'error': 'Favorite not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def deactivate_book(request):
    user = request.user
    if (user.is_librarian):
        isbn  = request.data.get('isbn')
        if not isbn :
            return Response({'error':'ISBN is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            updated = Book.objects.filter(isbn = isbn).update(is_active=False)
            if not updated:
                return Response({'error': 'Book not found.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_403_FORBIDDEN)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_all_authors(request):
#     user = request.user
#     if ( user.is_librarian ):
#         authors = Author.objects.all()
#         return Response(authors, status=status.HTTP_200_OK)
#     return Response(status=status.HTTP_403_FORBIDDEN)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_all_categories(request):
#     user = request.user
#     if ( user.is_librarian ):
#         categories = Category.objects.all()
#         return Response(categories, status=status.HTTP_200_OK)
#     return Response(status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_google_books(request):
    user = request.user
    if ( user.is_librarian ):
        try:
            query = request.query_params.get("q")
            if not query:
                return Response({"error": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)
            result = GoogleBooksService.fetch_volumes(query)
            return Response(result, status = status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status = status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_403_FORBIDDEN)