import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {InventoryWem} from "../../../core/models/products.inventories.response";
import {ProductService} from "../../../core/services/products/product.service";
import {FormControl} from "@angular/forms";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {onNotificationMessage} from "../../../core/store/core.actions";

@Component({
  selector: 'app-products-inventories',
  templateUrl: './products-inventories.component.html',
  styleUrls: ['./products-inventories.component.scss']
})
export class ProductsInventoriesComponent  {
  isLoading = false;

  displayedColumns: string[] = ['form', 'product', 'initial', 'sell', 'return', 'purchase', 'issue','final', 'couverture'];
  dataSource: MatTableDataSource<InventoryWem>;
  @ViewChild("proposalPaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }
  @ViewChild(MatSort) sort: MatSort;

  numberOfMonthsCtrl = new FormControl("");

  subscriptions: Subscription[] = [];
  constructor(private productService: ProductService, private store:Store<CoreState>) { }

  actualiser():void{
    if(this.numberOfMonthsCtrl.value){
      this.isLoading = true;
      const  sub = this.productService.loadInventories(this.numberOfMonthsCtrl.value).subscribe(res =>{
        if(res?.errorCode === 2){
          this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: res?.errorMessage}));
          this.isLoading = false;
          return;
        }
        this.dataSource =new MatTableDataSource<InventoryWem>(res?.results);
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      })
    }
  }

}
