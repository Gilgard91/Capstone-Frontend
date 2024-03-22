import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { OrderHistoryResponse } from 'src/app/interfaces/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  orderHistoryList: OrderHistoryResponse[] = [];
  storage: Storage = sessionStorage;
  loadingData: boolean = true;

  constructor(private orderHistorySrv: OrderHistoryService) {}

  ngOnInit(): void {
    this.handleOrderHistory();

    setTimeout(() => {
      this.loadingData = false;
    }, 2000);
  }

  handleOrderHistory() {
    const email = this.storage.getItem('userEmail')!;
    this.orderHistorySrv.getOrderHistory(email).subscribe({
      next: (res) => {
        this.orderHistoryList = res;

        console.log('order-history: ', res);
        console.log('history: ', this.orderHistoryList);
      },
    });
  }
}
