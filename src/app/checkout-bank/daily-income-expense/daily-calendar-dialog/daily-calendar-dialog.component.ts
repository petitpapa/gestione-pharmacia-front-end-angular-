import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-daily-calendar-dialog",
  templateUrl: "./daily-calendar-dialog.component.html",
  styleUrls: ["./daily-calendar-dialog.component.scss"],
})
export class DailyCalendarDialogComponent implements OnInit {
  dateGroup = new FormGroup({
    chosenDate: new FormControl(""),
  });

  constructor(    public dialogRef: MatDialogRef<DailyCalendarDialogComponent>,) {}

  ngOnInit(): void {}

  confirm(): void {
    this.dialogRef.close({
      ...this.dateGroup.value,
    });
  }
}
