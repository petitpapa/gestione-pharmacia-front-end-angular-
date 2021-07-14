import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import moment from "moment";
interface OrderInvoiceHistories {
  orderId: number;
  total: number;
  amountPaid: number;
  paidOn: Date;
  notes: string;
}
@Component({
  selector: "app-customer-order-details",
  templateUrl: "./customer-order-details.component.html",
  styleUrls: ["./customer-order-details.component.scss"],
})
export class CustomerOrderDetailsComponent implements OnInit {
  amountControl = new FormControl("");
  noteControl = new FormControl("");
  displayedColumns: string[] = ["paid", "date", "notes"];
  dataSource: MatTableDataSource<any>;

  @ViewChild("historiesPaginator") set proposalPaginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  total: number;
  totalPaid: number;

  isLoading = false;
  constructor(
    public dialogRef: MatDialogRef<CustomerOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const orders: OrderInvoiceHistories[] = this.data?.orderHistories;
    this.total = orders[0].total;
    this.totalPaid = orders
      .map((o) => o.amountPaid)
      .reduce((total, num) => total + num, 0);
    this.dataSource = new MatTableDataSource<any>(this.data?.orderHistories);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public formatDate(date: Date): string {
    return moment(date).format(" D/MM/YYYY,  h:mm:ss");
  }

  onConfirm(): void {
    this.dialogRef.close({
      amount: this.amountControl.value,
      note: this.noteControl.value,
    });
  }
}
