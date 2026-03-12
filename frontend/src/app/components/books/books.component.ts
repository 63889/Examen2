import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../../models/book.model';
import { BookManagementService } from '../../services/book-management.service';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-books',
  imports: [NgIf, FormsModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  public books: Book[] = [];
  public filteredBooks: Book[] = [];
  public loading = false;
  public query: string = '';

  constructor(private bookManagementService: BookManagementService, private router: Router) { }

  async ngOnInit() {
    try {
      this.loading = true;
      this.books = await this.bookManagementService.getAllBooks();
      this.filteredBooks = [...this.books];
    } catch (err) {
      console.error('Failed to fetch books', err);
    } finally {
      this.loading = false;
    }
  }

  filterBooks() {
    const q = this.query.toLocaleLowerCase().trim();
    if (!q) {
      this.filteredBooks = [...this.books];
    }else{
       this.filteredBooks = this.books.filter(b => 
        b.title.toLowerCase().includes(q) || 
        (b.authors ?? []).join('').toLowerCase().includes(q) || 
        (b.categories ?? []).join('').toLowerCase().includes(q)
      );
    }
  }

  goToBook() {
    this.router.navigate(['/dashboard/book']);
  }

  async updateBook(book: Book) {
    this.loading = true;
    this.bookManagementService.setBookSubject(book);
    this.loading = false;
    this.router.navigate(['/dashboard/book'], { queryParams: { 'mode': 'updating' } })
  }


  async deleteBook(isbn: string) {
    try {
      const result = await this.bookManagementService.deleteBook(isbn);
      if (result.status === 200) {
        this.books = this.books.filter(b => b.isbn !== isbn);
      }
    } catch (err) {
      console.log('Failed to delete book', err);
    }
  }

}
