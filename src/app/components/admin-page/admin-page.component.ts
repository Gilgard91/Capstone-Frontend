import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { AdminService } from 'src/app/services/admin.service';

import { MatDialog } from '@angular/material/dialog';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { Customer } from 'src/app/interfaces/customer';
import { Order, OrderResponse } from 'src/app/interfaces/order';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements OnInit {
  categoryFilter: string = 'nuovi+arrivi';
  filteredProducts: Product[] = [];
  allProducts: Product[] = [];

  searchFilter: string = '';
  searchedProducts: Product[] = [];

  customerFilter: string = '';
  filteredOrders: Order[] = [];
  // allOrders: Order[] = [];
  allCustomers: Customer[] = [];

  constructor(private adminSrv: AdminService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getAllProducts();
    this.getProductsByCategory();
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.adminSrv.getCustomersList().subscribe({
      next: (res) => {
        this.allCustomers = res;
      },
    });
  }

  updateOrderStatus(order: OrderResponse) {
    this.adminSrv.updateOrderStatus(order).subscribe({
      next: () => {
        console.log("Stato dell'ordine aggiornato");
      },
    });
  }

  getOrdersByCustomerEmail() {
    this.adminSrv.getOrdersByEmail(this.customerFilter).subscribe({
      next: (res) => {
        this.filteredOrders = res;
      },
    });
  }

  applyCustomerFilter() {
    this.getOrdersByCustomerEmail();
  }

  getAllProducts() {
    this.adminSrv.getProductsList().subscribe({
      next: (res) => {
        this.allProducts = res.content;
      },
    });
  }

  getProductsByCategory() {
    this.adminSrv.getProductsByCategory(this.categoryFilter).subscribe({
      next: (res) => {
        this.filteredProducts = res;

        console.log(res);
      },
    });
  }

  getProductsByName() {
    this.adminSrv.getProductsByName(this.searchFilter).subscribe({
      next: (res) => {
        this.searchedProducts = res;
        this.filteredProducts = this.searchedProducts;
        console.log(res);
      },
    });
    this.allProducts = [];
  }

  applyCategoryFilter() {
    this.getProductsByCategory();
  }

  applySearchFilter() {
    this.getProductsByName();
  }

  openEditDialog(product: Product): void {
    if (product) {
      console.log('Product:', product);
      const dialogRef = this.dialog.open(MyModalComponent, {
        width: '500px',
        data: {
          id: product.id,
          sku: product.sku,
          name: product.name,
          description: product.description,
          unitPrice: product.unitPrice,
          imageUrl: product.imageUrl,
          active: product.active,
          unitsInStock: product.unitsInStock,
          lastUpdated: product.lastUpdated,
          category: product.category,
        },
      });
      dialogRef.componentInstance.onSave.subscribe(
        (updatedProduct: Product) => {
          const index = this.filteredProducts.findIndex(
            (product) => product.id === updatedProduct.id
          );
          if (index !== -1) {
            this.filteredProducts[index] = updatedProduct;
          }
        }
      );
    } else {
      console.error('errore');
    }
  }

  deleteProduct(productId: number) {
    this.adminSrv.deleteProduct(productId).subscribe({
      next: () => {
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product.id !== productId
        );
      },
      error: (err) => {
        console.error('Errore', err);
      },
    });
  }
}
