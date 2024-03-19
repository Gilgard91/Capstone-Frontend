import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CategoryResponse, Product } from 'src/app/interfaces/product';
import { AdminService } from 'src/app/services/admin.service';
export interface ModalData {
  id: number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock: number;
  dateCreated: Date;
  lastUpdated: Date;
  category: CategoryResponse;
}
@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.scss'],
})
export class MyModalComponent implements OnInit {
  onSave: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(
    public dialogRef: MatDialogRef<MyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private adminSrv: AdminService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.adminSrv.updateProduct(this.data).subscribe({
      next: (updatedProduct) => {
        console.log('Prodotto aggiornato:', updatedProduct);
        this.onSave.emit(updatedProduct);

        this.dialogRef.close();
      },
      error: (error) => {
        console.error('errore', error);
      },
    });
  }

  ngOnInit() {}
}
