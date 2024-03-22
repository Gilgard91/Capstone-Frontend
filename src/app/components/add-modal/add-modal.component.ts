import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AdminService } from 'src/app/services/admin.service';
import { CategoryResponse, Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  onSave: EventEmitter<Product> = new EventEmitter<Product>();
  categories: CategoryResponse[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private adminSrv: AdminService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.adminSrv.addProduct(this.data).subscribe({
      next: (newProduct) => {
        console.log('Prodotto aggiunto:', newProduct);
        this.onSave.emit(newProduct);

        this.dialogRef.close();
      },
      error: (error) => {
        console.error('errore', error);
      },
    });
  }

  getCategories(): void {
    this.adminSrv.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Errore: ', error);
      },
    });
  }

  ngOnInit() {
    this.getCategories();
  }
}
