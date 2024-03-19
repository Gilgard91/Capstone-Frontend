import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product, ProductResponse } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getProductsByCategory(category: string): Observable<Product[]> {
    const url = `http://localhost:3001/products/findByCategoryName?categoryName=${category}`;
    return this.http.get<Product[]>(url);
  }

  updateProduct(product: Product): Observable<Product> {
    const url = `http://localhost:3001/products/${product.id}`;
    return this.http.put<Product>(url, product);
  }

  getProductsList(): Observable<ProductResponse> {
    const url = 'http://localhost:3001/products/list';
    return this.http.get<ProductResponse>(url);
  }

  getProductsByName(name: string): Observable<Product[]> {
    const url = `http://localhost:3001/products/findByNameList?name=${name}`;
    return this.http.get<Product[]>(url);
  }

  deleteProduct(id: number): Observable<Product> {
    const url = `http://localhost:3001/products/${id}`;
    return this.http.delete<Product>(url);
  }
}
