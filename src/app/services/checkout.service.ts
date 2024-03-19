import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../interfaces/purchase';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:3001/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
