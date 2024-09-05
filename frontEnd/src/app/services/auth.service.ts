import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:9000/api'; // Base API URL
  private loginUrl = `${this.apiUrl}/login`;
  private logoutUrl = `${this.apiUrl}/logout`; // Add logout endpoint

  constructor(
    private http: HttpClient,
    private router: Router // Inject Router
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(email: string, password: string, tokenName?: string): Observable<any> {
    const data = {
      email: email,
      password: password,
      token_name: tokenName || 'default_token_name'
    };
    return this.http.post<any>(this.loginUrl, data);
  }

  // New logout method
  logout(): Observable<any> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return new Observable(observer => {
      this.http.post(this.logoutUrl, {}, { headers }).subscribe(
        () => {
          this.clearAuthData();  // Clear authentication data from local storage
          observer.next(true);
          observer.complete();
        },
        error => {
          console.error('Logout error', error);
          // Even if the server request fails, clear local data
          this.clearAuthData();
          observer.next(false);
          observer.complete();
        }
      );
    });
  }


  // Helper method to clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('authToken');
    // Clear any other auth-related data you might have stored
    this.router.navigate(['/login']); // Redirect to login page
  }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>('http://localhost:9000/api/user', { headers });
}

}