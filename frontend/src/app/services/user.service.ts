import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../models/user.login';

import api from '../auth.interceptor';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // attemt to refresh local stored data if an access token exists
    if (localStorage.getItem('access_token')) {
      this.loadUser();
    }
  }

  isAdmin(user: User): boolean {
    return user.role === 'ADMIN'
  }
  isLibrarian(user: User): boolean {
    return user.role === 'LIB';
  }
  isUser(user: User): boolean {
    return user.role === 'USER';
  }

  async loginUser(loginRequest: LoginRequest) {

    const request = { "email": loginRequest.email, "password": loginRequest.password };
    const response = await api.post<LoginResponse>('/users/login/', request);

    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);

    await this.loadUser();

    return response;
  }

  isLoggedIn(): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user;
  }

  async registerUser(user: User) {
    return await api.post('/users/register/', user);
  }

  async updateUser(userData: Partial<User>, imageFile: File | null) {
    const formData = new FormData();
    formData.append('first_name', userData.first_name || '');
    formData.append('last_name', userData.last_name || '');
    if (imageFile instanceof File) {
      formData.append('file', imageFile);
    }

    try {
      const response = await api.patch<User>('/users/update_user/', formData);
      this.currentUserSubject.next(response.data);
      // await this.loadUser();
    } catch (error: any) {
      console.log(error);
    }
  }

  async getMyself() {
    return api.get('/users/get_me/');
  }

  async loadUser() {
    try {
      const response = await this.getMyself();
      const userData = response.data;
      this.currentUserSubject.next(userData);
      localStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error: any) {
      console.log(error);
    }
  }

  getStoredUser() {
    const storedUser = localStorage.getItem('user_data');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  async logout() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        await api.post('/users/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear()
      this.currentUserSubject.next(null);
      window.location.href = '/login';
    }
  }
}


// private apiUrl = '/users/';
// private currentUserSubject = new BehaviorSubject<User | null>(null);
// public currentUser$ = this.currentUserSubject.asObservable();

// constructor(private http: HttpClient) { }

// registerUser(user: User): Observable<User> {
//   return this.http.post<User>(this.apiUrl + 'register/', user).pipe(
//     catchError(this.handleError)
//   );
// }

// loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
//   const request = { "email": loginRequest.email, "password": loginRequest.password }
//   return this.http.post<LoginResponse>(this.apiUrl + 'login/', request).pipe(
//     catchError(this.handleError)
//   );
// }

// updateUser(user: Partial<User>): Observable<User> {
//   return this.http.patch<User>(this.apiUrl + 'update_user/', user).pipe(
//     catchError(this.handleError)
//   );
// }

// private handleError(error: any) {
//   let e = error.error?.detail ||
//     error.error?.message ||
//     JSON.stringify(error.error) ||
//     'Server Error';

//   let errorMessage: string;

//   if (typeof e === 'string' && (e.includes('{') || e.includes('['))) {
//     errorMessage = "One or more validation errors detected. Please check your data.";
//   } else {
//     errorMessage = e;
//   }

//   return throwError(() => new Error(errorMessage));
// }

// getMyself(): Observable<User> {
//   return this.http.get<User>(this.apiUrl + 'get_me/').pipe(
//     catchError(this.handleError)
//   );
// }

// loadUser() {
//   this.getMyself().subscribe(user => {
//     this.currentUserSubject.next(user);
//   });
// }

