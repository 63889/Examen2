import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { BooksComponent } from './components/books/books.component';
import { BookComponent } from './components/book/book.component';
import { GoogleBooksComponent } from './components/google-books/google-books.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate:[authGuard],
        children: [
            {path: 'user-profile', component: ProfileComponent},
            {path: 'home', component: HomeComponent},
            {path: 'libs', component: UsersComponent},
            {path: 'books', component: BooksComponent},
            {path: 'book', component: BookComponent},
            {path: 'google-books', component: GoogleBooksComponent},
            {path: '', redirectTo: 'home', pathMatch: 'full'}
        ]
    },
    {path: '**', redirectTo: 'login'},
];
