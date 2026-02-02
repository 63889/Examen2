import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LoginRequest } from '../../models/user.login';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public email: string = '';
  public password: string = '';
  public errorMessage: string = '';
  public showAccountCreationSuccessMessage = false;
  public isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.showAccountCreationSuccessMessage = true;
      }
    });
  }

  login() {
    this.isLoading = true;
    this.errorMessage = '';
    const loginRequest: LoginRequest = {
      email: this.email,
      password: this.password
    };

    this.userService.loginUser(loginRequest).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        this.userService.loadUser();
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
        console.error("Login failed ", err);
      }
    });
  }
}
