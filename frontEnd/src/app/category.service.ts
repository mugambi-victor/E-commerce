import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    return this.http.get<any>(this.apiUrl);
  }

  addCategory(category: { category_name: string; category_description: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateCategory(id: string, category: { category_name: string; category_description: string }): Observable<any> {
    console.log(`Updating category with ID: ${id}`);
    console.log('Category Data:', category);
  
    return this.http.put<any>(`${this.apiUrl}/${id}`, category).pipe(
      tap(response => console.log('Update response:', response)),
      catchError(error => {
        console.error('Update error:', error);
        return throwError(() => error);
      })
    );
  }
  
}