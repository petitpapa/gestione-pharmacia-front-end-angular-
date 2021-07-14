import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { ProductInventoryRequest } from "../../../core/models";
import { InventoryWem } from "../../../core/models/products.inventories.response";
import { ProductService } from "../../../core/services/products/product.service";
import { onNotificationMessage } from "../../../core/store/core.actions";
import { CoreState } from "../../../core/store/core.reducer";

@Component({
  selector: "app-audit-previous-month",
  templateUrl: "./audit-previous-month.component.html",
  styleUrls: ["./audit-previous-month.component.scss"],
})
export class AuditPreviousMonthComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = [
    "form",
    "product",
    "price",
    "initial",
    "final",
    "difference",
  ];
  dataSource: MatTableDataSource<InventoryWem>;

  @ViewChild("previousMonthInvPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private productService: ProductService,
    private store: Store<CoreState>
  ) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const request: ProductInventoryRequest = {
      isPreviousMonth: true,
    };
    const response = await this.productService
      .loadInventories(request)
      .toPromise();
    if (response.errorCode === 2) {
      this.store.dispatch(
        onNotificationMessage({ msgType: "ERROR", msg: response.errorMessage })
      );
      this.isLoading = false;
      return;
    }
    this.dataSource = new MatTableDataSource<InventoryWem>(response.results);

    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }
}
