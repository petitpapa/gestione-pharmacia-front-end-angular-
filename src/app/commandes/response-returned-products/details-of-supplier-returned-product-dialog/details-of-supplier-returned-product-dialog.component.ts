import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ReturnedProduct} from "../../../core/models/product.return.response";

@Component({
  selector: 'app-details-of-supplier-returned-product-dialog',
  templateUrl: './details-of-supplier-returned-product-dialog.component.html',
  styleUrls: ['./details-of-supplier-returned-product-dialog.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class DetailsOfSupplierReturnedProductDialogComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<DetailsOfSupplierReturnedProductDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: ReturnedProduct) { }

  ngOnInit(): void {
  }

  emitUpdatedData() {
    this.dialogRef.close(this.data);
  }
}
