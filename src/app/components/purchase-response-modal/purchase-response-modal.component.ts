import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from 'backbone';

@Component({
  selector: 'app-purchase-response-modal',
  templateUrl: './purchase-response-modal.component.html',
  styleUrls: ['./purchase-response-modal.component.scss'],
})
export class PurchaseResponseModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PurchaseResponseModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onConfirmClick(): void {
    this.dialogRef.close();
  }
}
