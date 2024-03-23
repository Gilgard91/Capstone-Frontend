import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CategoryResponse,
  Product,
  ProductResponse,
} from '../interfaces/product';
import { Customer } from '../interfaces/customer';
import { OrderResponse } from '../interfaces/order';

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

  getCustomersList(): Observable<Customer[]> {
    const url = 'http://localhost:3001/checkout/customers';
    return this.http.get<Customer[]>(url);
  }

  getOrdersByEmail(email: string): Observable<OrderResponse[]> {
    const url = `http://localhost:3001/orders/findByEmail?email=${email}`;
    return this.http.get<OrderResponse[]>(url);
  }

  getOrdersList(): Observable<OrderResponse[]> {
    const url = 'http://localhost:3001/orders';
    return this.http.get<OrderResponse[]>(url);
  }

  updateOrderStatus(order: OrderResponse): Observable<OrderResponse> {
    const url = `http://localhost:3001/orders/${order.id}`;
    return this.http.put<OrderResponse>(url, order);
  }

  addProduct(product: Product): Observable<Product> {
    const url = 'http://localhost:3001/products';
    const oktaTokenStorage = JSON.parse(
      localStorage.getItem('okta-token-storage')
    );
    const accessToken = oktaTokenStorage.accessToken.accessToken;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.post<Product>(url, product, { headers });
  }

  getCategories(): Observable<CategoryResponse[]> {
    const url = 'http://localhost:3001/category';
    return this.http.get<CategoryResponse[]>(url);
  }
}
