import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  public first_name: string = '';
  public last_name: string = '';
  public email?: string = '';
  public fullName: string = '';

  public isEditing:boolean  = false;
  public isLoading: boolean = false;
  public transMessage: any = {};

  constructor(private userService: UserService, private router: Router) {}
 
  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      console.log(user);
      this.first_name = user ? user.first_name : 'John';
      this.last_name = user ? user.last_name : 'Doe';
      this.email = user ? user.email : 'johndoe@unavailable?.com';
      this.fullName = `${this.first_name} ${this.last_name}`; 
    });
  }

  handleSubmit(){
    this.isLoading = true;
    this.transMessage = {};
    const updateUserRequest: User = {
      first_name: this.first_name,
      last_name: this.last_name
    };

    this.userService.updateUser(updateUserRequest).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEditing = false;
        this.userService.loadUser();
        this.transMessage = {message:"User profile successfully updated.", class:"success"};
        console.log(this.transMessage);
        this.router.navigate(['/dashboard/user-profile'])
      },
      error: (err) => {
        this.isLoading = false;
        this.isEditing = false;
        this.transMessage = this.transMessage = {message:err.message, class:"danger"};
        console.log("Update user profile request failed: ", err);
      }
    });
  }
}
