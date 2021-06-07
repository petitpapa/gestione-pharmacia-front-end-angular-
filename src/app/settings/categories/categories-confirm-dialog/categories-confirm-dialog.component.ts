import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-categories-confirm-dialog",
  templateUrl: "./categories-confirm-dialog.component.html",
  styleUrls: ["./categories-confirm-dialog.component.scss"],
})
export class CategoriesConfirmDialogComponent implements OnInit {

  choice = undefined;
  constructor(
    public dialogRef: MatDialogRef<CategoriesConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close('confirm');
  }
}
