import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { NgIf } from '@angular/common';
import { FormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

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
  public profile_picture_url?: string = '';
  public file: File | null = null;

  public isEditing:boolean  = false;
  public isLoading: boolean = false;
  public transMessage: any = {};

  constructor(private userService: UserService, private router: Router) {}
 
  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => {
      if(user){
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.fullName = `${this.first_name} ${this.last_name}`;
        this.profile_picture_url = user.profile_picture_url;
      }else{
        this.fullName = 'Guest';
      }

    });
  }

  onFileSelected(event:any): void{
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0){
      this.file = fileInput.files[0];
    }else{
      this.file = null;
    }
  }

  async handleSubmit(){
    this.isLoading = true;
    this.transMessage = {};
    const updateUserRequest: Partial<User> ={
      first_name: this.first_name,
      last_name: this.last_name
    }
    try{
      await this.userService.updateUser(updateUserRequest, this.file);
      this.router.navigate(['/dashboard/user-profile']);
      this.transMessage = {message: "User profile successfully updated.", class: "success"};
    }catch(error:any){
      this.transMessage = {message: "User profile request failed.", class: "danger"};
      console.log(error);
    }finally{
      this.isLoading = false;
      this.isEditing = false;
    }

    // this.userService.updateUser(updateUserRequest).subscribe({
    //   next: () => {
    //     this.isLoading = false;
    //     this.isEditing = false;
    //     this.userService.loadUser();
    //     this.transMessage = {message:"User profile successfully updated.", class:"success"};
    //     console.log(this.transMessage);
    //     this.router.navigate(['/dashboard/user-profile'])
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.isEditing = false;
    //     this.transMessage = this.transMessage = {message:err.message, class:"danger"};
    //     console.log("Update user profile request failed: ", err);
    //   }
    // });
  }
}
