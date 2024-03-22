import { Component, OnInit, Inject, EventEmitter } from '@angular/core';
import {
  MatDialogRef,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { CategoryResponse, Product } from 'src/app/interfaces/product';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  onSave: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product,
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
