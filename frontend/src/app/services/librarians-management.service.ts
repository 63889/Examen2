import { Injectable } from '@angular/core';
import api from '../auth.interceptor';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LibrariansManagementService {

  constructor() { }

  async getAllLibrarians(){
    const response = await api.get('/users/get_all_librarians/');
    return response.data;
  }
  async addLibrarian(user: Partial<User>){
    return await api.post('/users/post_librarian/', user);
  }

  async updateLibrarian(user: User){
    return await api.patch('/users/update_librarian/', user);
  }

  async deleteLibrarian(user:User){
    return await api.patch('/users/delete_librarian/', user);
  }


}
