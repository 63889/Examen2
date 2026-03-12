import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, NgIf, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  get user$(){
    return this.userService.currentUser$;
  }
  constructor(public userService: UserService, private router: Router) { }

  goToLibDashBoard(){
    this.router.navigate(['/dashboard/libs']);
  }

  goToBookDashBoard(){
    this.router.navigate(['/dashboard/books']);
  }

  goToGoogleBooks(){
    this.router.navigate(['/dashboard/google-books'])
  }

  goToBook(){
    this.router.navigate(['/dashboard/book']);
  }

  goToHome(){
    this.router.navigate(['/dashboard/home']);
  }

  goToProfile() {
    this.router.navigate(['/dashboard/user-profile']);
  }

  async logout(){
    await this.userService.logout();
  }

}
