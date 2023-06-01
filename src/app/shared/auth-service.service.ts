import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/login/';
  private registerUrl = 'http://127.0.0.1:8000/register/';

  private accessToken = 'accessToken'; // Key for storing the token in localStorage
  loggedIn: boolean;
  username: string;

  constructor(private http: HttpClient) {
    this.loggedIn = this.checkToken(); // Initialize the login state based on the token
    this.username = this.getUsernameFromToken();
  }

  register(user: User) {
    const body = { ...user };
    return this.http.post(this.registerUrl, body).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem(this.accessToken, token);
        this.loggedIn = true;
        this.username = this.getUsernameFromToken();
      })
    );
  }


  login(user: User) {
    const body = { username: user.username, password: user.password };
    return this.http.post(this.apiUrl, body).pipe(
      tap((response: any) => {
        const token = response.token;
        localStorage.setItem(this.accessToken, token);
        this.loggedIn = true;
        this.username = this.getUsernameFromToken();
      })
    );
  }

  logout() {
    localStorage.removeItem(this.accessToken); // Remove the token from localStorage
    this.loggedIn = false;
    this.username = '';
  }

  private checkToken(): boolean {
    const token = localStorage.getItem(this.accessToken); // Retrieve the token from localStorage
    return !!token; // Return true if the token exists, false otherwise
  }

  private getUsernameFromToken(): string {
    const token = localStorage.getItem(this.accessToken); // Retrieve the token from localStorage
    // Implement logic to extract and decode the username from the token
    // Return the extracted username
    return ''; // Placeholder return statement
  }
}
