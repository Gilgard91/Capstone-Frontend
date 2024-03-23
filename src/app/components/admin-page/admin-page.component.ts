import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { AdminService } from 'src/app/services/admin.service';

import { MatDialog } from '@angular/material/dialog';
import { EditModalComponent } from '../edit-modal/edit-modal.component';
import { Customer } from 'src/app/interfaces/customer';
import { Order, OrderResponse } from 'src/app/interfaces/order';
import { AddModalComponent } from '../add-modal/add-modal.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

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

  loadingData: boolean = true;

  newProduct: Product = {
    id: null,
    sku: '',
    name: '',
    description: '',
    unitPrice: 0,
    imageUrl: '',
    active: false,
    unitsInStock: null,
    dateCreated: new Date(),
    lastUpdated: new Date(),
    category: { id: null, categoryName: '' },
  };

  constructor(private adminSrv: AdminService, public dialog: MatDialog) {}
  ngOnInit(): void {
    this.getAllProducts();
    this.getProductsByCategory();
    this.getAllCustomers();
    this.getCategories();
    this.loadingData = false;
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
    this.loadingData = true;
    this.adminSrv.getOrdersByEmail(this.customerFilter).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.filteredOrders = res;
          this.loadingData = false;
        }, 500);
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

  getCategories(): void {
    this.adminSrv.getCategories().subscribe({
      next: (categories) => {
        console.log('categorie: ', categories);
      },
      error: (error) => {
        console.error('Errore: ', error);
      },
    });
  }

  applyCategoryFilter() {
    this.getProductsByCategory();
  }

  applySearchFilter() {
    this.getProductsByName();
  }

  openAddModal(product: Product): void {
    const dialogRef = this.dialog.open(AddModalComponent, {
      width: '500px',
      data: {
        sku: this.generateSKU(8),
        name: product.name,
        description: product.description,
        unitPrice: product.unitPrice,
        imageUrl: product.imageUrl,
        active: product.active,
        unitsInStock: Math.floor(Math.random() * (1489 - 35 + 1)) + 35,
        lastUpdated: product.lastUpdated,
        category: product.category,
      },
    });
    dialogRef.componentInstance.onSave.subscribe((newProduct: Product) => {
      this.filteredProducts.push(newProduct);
    });
  }

  openEditModal(product: Product): void {
    if (product) {
      console.log('Product:', product);
      const dialogRef = this.dialog.open(EditModalComponent, {
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
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '250px',
      data: { productId: productId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
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
    });
  }

  generateSKU(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let sku = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      sku += characters.charAt(randomIndex);
    }
    return sku;
  }
}
