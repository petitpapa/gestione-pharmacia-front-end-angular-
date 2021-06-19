import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ProductDetailResponse, ProductRow} from "../../../core/models";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {ProductService} from "../../../core/services/products/product.service";
import {CoreState} from "../../../core/store/core.reducer";
import {Store} from "@ngrx/store";
import {onNotificationMessage} from "../../../core/store/core.actions";

@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit, OnDestroy {
  isLoading = false;

  dataSource: MatTableDataSource<ProductRow>;
  displayedColumns: string[] = ['form', 'product', 'familly', 'codeBar', 'rayon'];
  @ViewChild("newProductsPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }
  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];

  startDate = new Date();
  endDate = new Date();

  constructor(private productService: ProductService, private store: Store<CoreState>) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  updateStartDate(startDateChanged: Date) {
    this.startDate = startDateChanged;
  }

  loadProducts(endDateChanged?: Date) {

    this.endDate= endDateChanged;
    if(this.endDate) {
      this.isLoading = true;
      const subsProducts = this.productService.loadProductsBetweenRange(this.startDate, this.endDate).subscribe(res => {
        if (res?.errorCode === 2) {
          this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: res?.errorMessage}))
          this.isLoading = false;
          return;
        }
        this.dataSource = new MatTableDataSource<ProductRow>(res?.products);
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      });
      this.subscriptions.push(subsProducts);
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
