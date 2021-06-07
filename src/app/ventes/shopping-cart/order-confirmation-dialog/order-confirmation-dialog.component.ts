import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-order-confirmation-dialog",
  templateUrl: "./order-confirmation-dialog.component.html",
  styleUrls: ["./order-confirmation-dialog.component.scss"],
})
export class OrderConfirmationDialogComponent {

  invoiceHistoryForm = new FormGroup({
    paid: new FormControl(''),
    notes: new FormControl('')
  });
  constructor(
    public dialogRef: MatDialogRef<OrderConfirmationDialogComponent>
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  onConfirm(): void {this.dialogRef.close(this.invoiceHistoryForm.value)}
}
