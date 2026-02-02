import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { LoginRequest, LoginResponse } from '../models/user.login';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/users/';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + 'register/', user).pipe(
      catchError(this.handleError)
    );
  }

  loginUser(loginRequest: LoginRequest): Observable<LoginResponse> {
    const request = { "email": loginRequest.email, "password": loginRequest.password }
    return this.http.post<LoginResponse>(this.apiUrl + 'login/', request).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: Partial<User>): Observable<User> {
    return this.http.patch<User>(this.apiUrl + 'update_user/', user).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    let e = error.error?.detail ||
      error.error?.message ||
      JSON.stringify(error.error) ||
      'Server Error';

    let errorMessage: string;

    if (typeof e === 'string' && (e.includes('{') || e.includes('['))) {
      errorMessage = "One or more validation errors detected. Please check your data.";
    } else {
      errorMessage = e;
    }

    return throwError(() => new Error(errorMessage));
  }

  getMyself(): Observable<User> {
    return this.http.get<User>(this.apiUrl + 'get_me/').pipe(
      catchError(this.handleError)
    );
  }

  loadUser() {
    this.getMyself().subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(this.apiUrl);
  // }

  // addUser(user: User): Observable<User> {
  //   return this.http.post<User>(this.apiUrl, user);
  // }
}
