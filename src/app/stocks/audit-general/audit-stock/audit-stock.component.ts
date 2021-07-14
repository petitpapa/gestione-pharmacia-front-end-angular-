import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {InventoryWem} from "../../../core/models/products.inventories.response";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ProductService} from "../../../core/services/products/product.service";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {onNotificationMessage} from "../../../core/store/core.actions";
import { ProductInventoryRequest } from '../../../core/models';

@Component({
  selector: 'app-audit-stock',
  templateUrl: './audit-stock.component.html',
  styleUrls: ['./audit-stock.component.scss']
})
export class AuditStockComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = ['form', 'product', 'price','purchase','margin','initial', 'final','qtySell', 'qtyPurchase','return', 'suspended', 'emitted','accepted', 'couverture'];
  dataSource: MatTableDataSource<InventoryWem>;

  @ViewChild("proposalPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private productService: ProductService, private store: Store<CoreState>) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const request: ProductInventoryRequest ={
      actual: true
    }
    const response = await this.productService.loadInventories(request).toPromise();
    if (response.errorCode === 2){
      this.store.dispatch(onNotificationMessage({msgType:"ERROR", msg: response.errorMessage}));
      this.isLoading = false;
      return;
    }
    this.dataSource = new MatTableDataSource<InventoryWem>(response.results);
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

}
