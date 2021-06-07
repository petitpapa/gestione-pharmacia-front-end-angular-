import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Customer, MessageType } from "../../../core/models";
import { CustomerService } from "../../../core/services";
import { onNotificationMessage } from "../../../core/store/core.actions";
import { CoreState } from "../../../core/store/core.reducer";

@Component({
  selector: "app-add-customer-dialog",
  templateUrl: "./add-customer-dialog.component.html",
  styleUrls: ["./add-customer-dialog.component.scss"],
})
export class AddCustomerDialogComponent implements OnInit, OnDestroy {
  customers: Customer[];
  subscription$: Subscription;
  isLoading = false;

  displayedColumns: string[] = [
    "select",
    "position",
    "photo",
    "name",
    "birthday",
    "birthPlace",
    "address",
    "phoneNumber",
    "email",
  ];
  dataSource: MatTableDataSource<Customer>;
  selection = new SelectionModel<Customer>(false, []);

  constructor(
    private customerService: CustomerService,
    private store: Store<CoreState>,
    public dialogRef: MatDialogRef<AddCustomerDialogComponent>
  ) {}

  ngOnInit(): void {
    this.subscription$ = this.loadCustomers();
  }

  private loadCustomers() {
    this.isLoading = true;
    return this.customerService.loadCustomers().subscribe((res) => {
      if (res.errorCode === 2) {
        this.dispatchError(res);
      } else {
        this.customers = res.customers;
        this.dataSource = new MatTableDataSource<Customer>(this.customers);
        console.log(this.customers);
      }
      this.isLoading = false;
    });
  }

  private dispatchError(res: any): void {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: "Une erreur c est produite: ".concat(res?.errorMessage),
      })
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Customer): string {
    if (!row) {
      return `${this.isAllSelected() ? "select" : "deselect"} all`;
    }
    return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${
      row.customerId + 1
    }`;
  }

  onConfirm(): void {
    this.dialogRef.close(this.selection.selected[0]);
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.unsubscribe();
    }
  }
}
