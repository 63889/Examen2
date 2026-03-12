import { Component } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { Book } from '../../models/book.model';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-books',
  imports: [FormsModule, NgIf],
  templateUrl: './google-books.component.html',
  styleUrl: './google-books.component.css'
})

export class GoogleBooksComponent {
  public books: Book[] = [];
  public loading: boolean = false;
  public searchQuery: string = '';

  constructor(private bookManagementService: BookManagementService, private router: Router) { }

  search(){
    this.fetchGoogleBooks(this.searchQuery);
  }

  async fetchGoogleBooks(query: string) {
    if (query != '') {
      this.loading = true;
      this.books = await this.bookManagementService.getBookFromGoogle(query);
      console.log(this.books);
      this.loading = false;
    }
  }

  uploadGoogleBook(index:number){
    this.loading = true;
    const book:Book = this.books[index];
    this.bookManagementService.setBookSubject(book);
    this.loading = false;
    this.router.navigate(['/dashboard/book'], {queryParams: {mode:'adding'}});
  }


}
