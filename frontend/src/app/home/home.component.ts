import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Book } from '../models/book.model';
import { BookManagementService } from '../services/book-management.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public books: Book[] = [];
  public favoriteBooks: string[] = [];
  public authors: string = '';
  public loading: boolean = false;
  get user$() {
    return this.userService.currentUser$;
  }

  constructor(public userService: UserService, private bookManagementService: BookManagementService, private router: Router) { }

  async ngOnInit() {
    try {
      this.loading = true;
      this.books = await this.bookManagementService.getAllBooks();
      const response = await this.bookManagementService.getFavoriteBooks();
      console.log("Actual list of favorite books: ", response);
      this.favoriteBooks = response.map((fb: any) => fb.isbn);
      console.log(this.favoriteBooks);
    } catch (err) {
      console.error('Failed to fetch book', err);
    } finally {
      this.loading = false;
    }
  }

  async toggleFavorite(isbn: string) {
    if (!isbn) return;
    try {
      if (this.isFavorite(isbn)) {
        const response = await this.bookManagementService.removeFavorite(isbn);
        this.favoriteBooks = this.favoriteBooks.filter(fb => fb !== isbn);
      } else {
        const response = await this.bookManagementService.addFavorite(isbn);
        this.favoriteBooks = [...this.favoriteBooks, isbn];
      }
    } catch (err) {
      console.error('Failed to add a favorite book', err);
    } finally {
      console.log(this.favoriteBooks);
    }
  }

  isFavorite(isbn: string) {
    // console.log('checking if: ', isbn, ' is in: ', this.favoriteBooks )
    return this.favoriteBooks.includes(isbn);
  }

}

