import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public userName: string = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      this.userName = user ? `${user.first_name} ${user.last_name}` : 'Guest';
    });
  }

  goToProfile() {
    this.router.navigate(['/dashboard/user-profile']);
  }

}
