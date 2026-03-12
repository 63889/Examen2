import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LibrariansManagementService } from '../../services/librarians-management.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  public users: Array<User | any> = [];
  public first_name: string = '';
  public last_name: string = '';
  public email: string = '';
  public password: string = '';
  public profile_picture_url: string = '';
  // public waiting = false;

  constructor(private libManagementService: LibrariansManagementService) { }

  async ngOnInit() {
    const data = await this.libManagementService.getAllLibrarians();
    this.users = data;
    console.log(data);
  }

  async addLibrarian() {
    // this.waiting = true;
    const addLibrarianRequest: User= {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      password: this.password
    }
    const response = await this.libManagementService.addLibrarian(addLibrarianRequest);
    console.log(response.data);
    this.users.push(response.data);
    this.first_name = '';
    this.last_name = '';
    this.email = '';
    this.password = '';
    
    // this.waiting = false;
  }
  enableEdit(user: User) {
    user.isEditing = true;
    user.editData = { ...user };
  }

  cancelEdit(user: User) {
    user.isEditing = false;
    user.editData = null;
  }

  saveEdit(user: User){
    this.libManagementService.updateLibrarian(user.editData).then(() => {
      Object.assign(user, user.editData);
      user.isEditing = false;
    })
  }

  async deleteLibrarian(user:User){
    const response = await this.libManagementService.deleteLibrarian(user);
    if (response.status == 200) {
      this.users  = this.users.filter(u => u.email !== user.email);
    }
  }
}