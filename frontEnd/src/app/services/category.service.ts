import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:9000/api/categories'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  getCategories(): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }

  addCategory(category: { category_name: string; category_description: string }): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.apiUrl, category, {headers});
  }

  deleteCategory(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {headers});
  }

  getCategoryById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, {headers});
  }

  updateCategory(id: string, category: { category_name: string; category_description: string }): Observable<any> {
    console.log(`Updating category with ID: ${id}`);
    console.log('Category Data:', category);
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<any>(`${this.apiUrl}/${id}`, category, {headers}).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(error => {
        console.error('Update error:', error);
        return throwError(() => error);
      })
    );
  }
  
}