import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ProductDetailResponse } from "../../../core/models";
import { VentesService } from "../../../core/services";

@Component({
  selector: "app-product-detail-dialog",
  templateUrl: "./product-detail-dialog.component.html",
  styleUrls: ["./product-detail-dialog.component.scss"],
})
export class ProductDetailDialogComponent implements OnInit {
  detail: ProductDetailResponse;

  constructor(
    public dialogRef: MatDialogRef<ProductDetailDialogComponent>,
    private orderService: VentesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async ngOnInit(): Promise<void> {
    this.detail = await this.orderService.loadProductDetail(this.data.id);
console.log(this.detail);
  }
}
