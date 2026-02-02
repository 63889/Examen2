import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent{
  // public first_name: string = '';
  // public last_name: string = '';
  // public email: string = '';
  // public password: string = '';
  
  // users: User[] = [];

  // constructor(private userService: UserService) { }

  // ngOnInit(): void {
  //   this.loadUsers();
  // }

  // loadUsers(): void {
  //   this.userService.getUsers().subscribe(users => {
  //     this.users = users;
  //     console.log('Users loaded:', this.users);
  //   });
  // }

  // addUser(): void {
  //   const newUser: User = {
  //     first_name: this.first_name,
  //     last_name: this.last_name,
  //     email: this.email,
  //     password: this.password
  //   };
  //   this.userService.addUser(newUser).subscribe(user => {
  //     this.users.push(user);
  //   });
  //   console.log("Adding new user:", newUser);
  // }
}