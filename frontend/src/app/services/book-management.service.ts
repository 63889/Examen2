import { Injectable } from '@angular/core';
import api from '../auth.interceptor';
import { Book } from '../models/book.model';
import { BehaviorSubject, Observable } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class BookManagementService {

  private bookSubject = new BehaviorSubject<Book | null>(null);
  book$ = this.bookSubject.asObservable();

  constructor() { }

  setBookSubject(book: Book) {
    this.bookSubject.next(book);
  }

  clearBookSubject() {
    this.bookSubject.next(null);
  }

  async getBookFromGoogle(query: string) {
    const googleBookRequest = { 'q': query };
    const response = await api.get<Book[]>('/catalog/fetch_google_books/', { params: googleBookRequest });
    return await response.data;
    // console.log(response.data)
    // return response.data;
  }

  async addBook(book: Partial<Book>){
    const response = await api.post('/catalog/add_book/', book);
    return await response.data;
  }

  async updateBook(book: Partial<Book>){
    const response = await api.patch('/catalog/update_book/', book);
    return await response.data;
  }

  async getAllBooks(){
    const response = await api.get('/catalog/get_all_books/');
    return await response.data;
  }

  async deleteBook(isbn:string){
    return await api.patch('/catalog/deactivate_book/', {isbn});
  }

  // User favorite books
  
  async getFavoriteBooks(){
    const response = await api.get('/catalog/get_favorite_books/');
    return await response.data;
  }

  async addFavorite(isbn:string){
    const response = await api.post('/catalog/add_favorite_book/', { isbn });
    return await response.data;
  }

  async removeFavorite(isbn:string){
    const response = await api.delete('/catalog/remove_favorite_book/', { data: { isbn }});
    return await response.data;
  }

  // OPEN LIBRARY'S EXTERNAL API
  // getBookPreviewData(isbn: string) {
  //   const bibKey = `ISBN:${isbn}`;
  //   axios.get(`https://openlibrary.org/api/books?bibkeys=${bibKey}&format=json&jscmd=viewapi`)
  //   .then(res => {
  //     console.log(res);
  //     console.log(res.data);

  //   }).catch(error => {
  //     console.log(`Error: ${error}`);
  //   });
  // }
}
