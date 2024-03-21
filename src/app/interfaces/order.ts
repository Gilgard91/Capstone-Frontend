import { Customer } from './customer';
import { OrderItem } from './order-item';

export class Order {
  totalQuantity!: number;
  totalPrice!: number;
  status!: string;
}

export interface OrderResponse {
  id: number;
  orderTrackingNumber: string;
  totalQuantity: number;
  totalPrice: number;
  status: null | string;
  dateCreated: Date;
  lastUpdated: Date;
  customer: Customer;
}
