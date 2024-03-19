import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { Product, ProductResponse } from '../interfaces/product';
import { CategoryResponse } from '../interfaces/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3001/products';
  private categoryUrl = 'http://localhost:3001/category';

  constructor(private httpClient: HttpClient) {}

  getSingleProduct(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductCategories(): Observable<CategoryResponse[]> {
    return this.httpClient.get<CategoryResponse[]>(this.categoryUrl);
  }

  getProductList(categoryId: number): Observable<ProductResponse[]> {
    const searchUrl = `${this.baseUrl}/findByCategoryId?id=${categoryId}`;
    return this.httpClient.get<ProductResponse[]>(searchUrl);
  }

  getProductListNewArrivals(): Observable<ProductResponse> {
    const searchUrl = `${this.baseUrl}/findByCategoryId?id=1`;
    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  getProductListTopSelling(): Observable<ProductResponse> {
    const searchUrl = `${this.baseUrl}/findByCategoryId?id=2`;
    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  getProductListPaginate(
    pageNumber: number,
    pageSize: number,
    categoryId: number
  ): Observable<ProductResponse> {
    const searchUrl =
      `${this.baseUrl}/findByCategoryId?id=${categoryId}` +
      `&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  searchProducts(keyword: string): Observable<ProductResponse> {
    const searchUrl = `${this.baseUrl}/findByName?name=${keyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(
    pageNumber: number,
    pageSize: number,
    keyword: string
  ): Observable<ProductResponse> {
    const searchUrl =
      `${this.baseUrl}/findByName?name=${keyword}` +
      `&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<ProductResponse>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(searchUrl);
  }
}
