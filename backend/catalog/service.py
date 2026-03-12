import os
from dotenv import load_dotenv
import requests

load_dotenv()

class GoogleBooksService:
    GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"
    @staticmethod
    def fetch_volumes(request):
        # request.must be string
        # "author:smt, "
        try:
            options = [(option.split(':'))for option in request.split(',')]

            if len(options) > 0:
                queries = []
                for o in options:
                    if len(o) > 1:
                        key = o[0].strip().lower()
                        value = o[1].strip().lower().replace(" ", "+")
                        queries.append(f"{key}:{value}") 
                    else:   
                        value = o[0].strip().lower().replace(" ", "+")
                        queries.append(f"{value}")
                query = "+".join(queries)
                params = {"q":query, "key":GoogleBooksService.GOOGLE_BOOKS_API_KEY}
                response  = requests.get(GoogleBooksService.BASE_URL, params=params)
                
                # print("Google status:", response.status_code)
                # print("Google response:", response.json()) 


                if response.status_code ==  200:
                    data  = response.json()
                    if "items" in data:
                        volumes = []
                        for i in data["items"]:
                            # As identifiers are not always present
                            isbn = i.get("id")
                            volume_info = i["volumeInfo"]
                            # identifiers = volume_info.get("industryIdentifiers", [])
                            # isbn = next(
                            #     (x["identifier"] for x in identifiers if x["type"] in ("ISBN_13", "ISBN_10")),
                            #     None )
                            book = {
                                "isbn": isbn,
                                "title": volume_info.get("title"),
                                "description": volume_info.get("description"),
                                "pub_date": volume_info.get("publishedDate"),
                                "page_count": volume_info.get("pageCount"),
                                "thumbnail": volume_info.get("imageLinks", {}).get("thumbnail"),
                                "search_info": volume_info.get("searchInfo", {}).get("textSnippet"),
                                "authors": volume_info.get("authors", []),
                                "categories": volume_info.get("categories", [])
                            }
                            volumes.append(book)
                        return volumes
                return []
        except Exception as e:
            print(e)
            return []