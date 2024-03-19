import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderHistoryResponse } from '../interfaces/order-history';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = 'http://localhost:3001/orders';

  constructor(private httpClient: HttpClient) {}

  getOrderHistory(email: string): Observable<OrderHistoryResponse[]> {
    const orderHistoryUrl = `${this.orderUrl}/findByEmail?email=${email}`;

    return this.httpClient.get<OrderHistoryResponse[]>(orderHistoryUrl);
  }
}
