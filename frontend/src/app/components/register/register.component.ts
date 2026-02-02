import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  public first_name: string = '';
  public last_name: string = '';
  public email: string = '';
  public password: string = '';
  public confirm_password: string = '';

  public errorMessage: string = '';
  public isLoading: boolean = false;

  constructor(private userService: UserService, private router: Router) { }

  register() {
    this.errorMessage = '';

    if (this.password != this.confirm_password) {
      this.errorMessage = "Passwords differ";
      return;
    }

    this.isLoading = true;

    const registerRequest: User = {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password
    };

    this.userService.registerUser(registerRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
        console.log("User registration request failed ", err);
      }
    });
  }
}
