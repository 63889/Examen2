import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { Book } from '../models/book.model';
import { BookManagementService } from '../services/book-management.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var google: any;

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  @ViewChild('viewerCanvas') viewerCanvas!: ElementRef;

  public books: Book[] = [];
  public filteredBooks: Book[] = [];
  public favoriteBooks: string[] = [];
  public authors: string = '';
  public loading: boolean = false;
  public search: string = '';
  public selectedPreviewUrl: SafeResourceUrl | null = null;

  get user$() {
    return this.userService.currentUser$;
  }

  constructor(
    public userService: UserService, 
    private bookManagementService: BookManagementService, 
    private router: Router,
    private santizer: DomSanitizer) { }

  async ngOnInit() {
    try {
      this.loading = true;
      this.books = await this.bookManagementService.getAllBooks();
      this.filteredBooks = [...this.books];
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

  filterBooks() {
    const q = this.search.toLowerCase().trim();
    if (!q) {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(book =>
        book.title.toLowerCase().includes(q) ||
        (book.authors ?? []).join('').toLowerCase().includes(q) ||
        (book.categories ?? []).join('').toLowerCase().includes(q));
    }
  }

  // seeBooksPreview(isbn:string) {
  //   const rawurl = `https://books.google.com/books?vid=ISBN:${isbn}&printsec=frontcover&output=embed`;
  //   this.selectedPreviewUrl = this.santizer.bypassSecurityTrustResourceUrl(rawurl);
  //   window.scrollTo({top:0, behavior: 'smooth'});
  // }

  closePreview() {
    this.selectedPreviewUrl = null;
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

