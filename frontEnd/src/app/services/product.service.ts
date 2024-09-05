import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:9000/api/products'; // Adjust the URL as needed

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is tjhe token",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }
  addProduct(product: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.apiUrl, product, { headers });
  }
  deleteProduct(productId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // The DELETE request includes the product ID in the URL
    return this.http.delete<any>(`${this.apiUrl}/${productId}`, { headers });
  }
  updateProduct(productId: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });
    // console.log(formData);
    return this.http.post<any>(`${this.apiUrl}/${productId}/update`, formData, { headers });
}
  getProductById(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    console.log("here is the token in get categories",token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/${id}`, {headers});
  }
}
