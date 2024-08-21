import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:9000/api/login'; // Adjust the URL

  constructor(private http: HttpClient) {}

  login(email: string, password: string, tokenName?: string): Observable<any> {
    const data = {
      email: email,
      password: password,
      token_name: tokenName || 'default_token_name'
    };
    return this.http.post<any>(this.apiUrl, data);
  }
}
