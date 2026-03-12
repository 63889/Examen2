import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-book',
  imports: [FormsModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  public book: Book | null = null;
  private destroyRef = inject(DestroyRef);
  public newBook: Partial<Book> = {};
  public isEditing: boolean = false;
  public authors?: string = '';
  public categories?: string = '';
  public quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private bookManagementService: BookManagementService,
    private router: Router) { }

  ngOnInit(): void {
    this.bookManagementService.book$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(b => {
        if (b) {
          this.authors = (b?.authors ?? []).join(', ');
          this.categories = (b?.categories ?? []).join(', ');
          this.newBook = { ...b };
          console.log(this.newBook);
        }
      });
    const mode = this.route.snapshot.queryParams['mode'] ?? 'adding';
    this.isEditing = mode === 'updating';
  }

  ngOnDestroy() {
    this.bookManagementService.clearBookSubject();
  }

  goBack() {
    history.back();
  }

  async saveBook() {
    // TODO mode
    if (this.newBook.isbn && this.newBook.title) {
      const saveBookRequest: Partial<Book> = { ...this.newBook };
      saveBookRequest.authors = this.authors?.split(',').map(i => i.trim());
      saveBookRequest.categories = this.categories?.split(',').map(i => i.trim());
      saveBookRequest.total_digital_licenses = (saveBookRequest.total_digital_licenses ?? 0) + this.quantity;
      saveBookRequest.digital_licenses_left = (saveBookRequest.digital_licenses_left ?? 0) + this.quantity;

      if(!this.isEditing){
        // saving new book
        const response = await this.bookManagementService.addBook(saveBookRequest);
        console.log(response.data);
      }else{
        // updating new book
        const response = await this.bookManagementService.updateBook(saveBookRequest);
        console.log(response.data);
      }
      this.router.navigate(['/dashboard/books']);
    }
  }


}
