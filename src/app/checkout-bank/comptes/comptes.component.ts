import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import moment from "moment";
import { Observable, Subscription } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from "rxjs/operators";
import { CustomerService, OrderService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import { CustomerOrderDetailsComponent } from "./customer-order-details/customer-order-details.component";

@Component({
  selector: "app-comptes",
  templateUrl: "./comptes.component.html",
  styleUrls: ["./comptes.component.scss"],
})
export class ComptesComponent implements OnInit, OnDestroy {
  myControl = new FormControl();
  subscriptions$: Subscription[] = [];

  filteredOptions: any[] = [];

  displayedColumns: string[] = [
    "name",
    "birthday",
    "phone",
    "createdOn",
    "amount",
    "actions",
  ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild("customerOrdersPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }
  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];

  isLoading = false;

  data = {};

  selectedCustomer;

  constructor(
    private customreSrv: CustomerService,
    private store: Store<CoreState>,
    public dialog: MatDialog,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const searchText$ = this.myControl.valueChanges.pipe(
      startWith(""),
      debounceTime(400),
      distinctUntilChanged()
    );

    const subAutoComplete = searchText$
      .pipe(switchMap((search) => this.findCustomer(search)))
      .subscribe((res) => {
        if (res?.errorCode === 2) {
          this.store.dispatch(
            onNotificationMessage({ msgType: "ERROR", msg: res?.errorMessage })
          );
          return;
        }
        this.filteredOptions = res?.customers;
      });
    this.subscriptions$.push(subAutoComplete);

    this.myControl.valueChanges.subscribe((value) => {
      this.selectedCustomer = value;
      this.loadCustomersOrders(value);
    });
  }

  private loadCustomersOrders(value: any) {
    this.isLoading = true;
    const infoSub = this.findCustomerOrders(value.split("-")[0]).subscribe(
      (res) => {
        this.dataSource.data = res?.customerOrderDtos;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.isLoading = false;
      }
    );
    this.subscriptions$.push(infoSub);
  }

  private findCustomer(search: any | string): Observable<any> {
    return this.customreSrv.findCustomer(search);
  }

  private findCustomerOrders(customerId: string): Observable<any> {
    return this.customreSrv.findCostomerOrders(customerId);
  }

  public formatDate(date: Date): string {
    return moment(date).format(" D/MM/YYYY,  h:mm:ss");
  }

  public async loadCustomerOrderDetail(
    orderId: number,
    detail?: boolean
  ): Promise<void> {
    this.data["orderHistories"] = null;
    this.data["orderDetails"] = null;
    this.data["description"] = null;
    if (detail) {
      const orderDetailsResponse = await this.orderService
        .loadOrderDetails(orderId)
        .toPromise();
      if (orderDetailsResponse?.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: "ERROR",
            msg: orderDetailsResponse.errorMessage,
          })
        );
        return;
      }
      this.data["orderDetails"] = orderDetailsResponse.orderDetails;
      this.data["description"] = "Details de la vente";
    } else {
      const orderHistoriesResponse = await this.orderService
        .loadOrderInvoiceHistories(orderId)
        .toPromise();
      if (orderHistoriesResponse?.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: "ERROR",
            msg: orderHistoriesResponse.errorMessage,
          })
        );
        return;
      }
      this.data["orderHistories"] =
        orderHistoriesResponse?.orderInvoiceHistories;
      this.data["description"] = "Details du paiment";
    }
    this.openDetail();
  }

  public async openDetail(): Promise<void> {
    const dialogRef = this.dialog.open(CustomerOrderDetailsComponent, {
      width: "80%",
      data: this.data,
    });

    const orderProperties = await dialogRef.afterClosed().toPromise();
    if (
      orderProperties?.amount > 0 &&
      this.data["orderHistories"]?.length > 0
    ) {
      const orderId = this.data["orderHistories"][0].orderId;
      orderProperties["orderId"] = orderId;
      const res = await this.orderService
        .updateOrderInvoiceHistories(orderProperties)
        .toPromise();
      if (res?.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({ msgType: "ERROR", msg: res?.errorMessage })
        );
        return;
      }
      this.store.dispatch(
        onNotificationMessage({ msgType: "SUCCESS", msg: res?.errorMessage })
      );
      this.loadCustomersOrders(this.selectedCustomer);
    }
    //this.subscriptions$.push(sub);
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions$) {
      subscription.unsubscribe();
    }
  }
}
