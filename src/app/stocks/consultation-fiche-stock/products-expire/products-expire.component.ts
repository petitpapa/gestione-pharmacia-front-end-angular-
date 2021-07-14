import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {ProductsAboutToExpire} from "../../../core/models/products.about.to.expire.response";
import {PharmaConfigService} from "../../../core/services/pharma-config.service";
import {ProductService} from "../../../core/services/products/product.service";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {onNotificationMessage} from "../../../core/store/core.actions";

@Component({
  selector: 'app-products-expire',
  templateUrl: './products-expire.component.html',
  styleUrls: ['./products-expire.component.scss']
})
export class ProductsExpireComponent implements OnInit, OnDestroy, AfterViewInit{
  displayedColumns: string[] = ['form', 'product', 'expiresOn', 'ppv', 'qty', 'supplier'];
  dataSource: MatTableDataSource<ProductsAboutToExpire>;
  @ViewChild("expirePaginator") set proposalPaginator(
    pager: MatPaginator
  ) {
    if (pager) {this.dataSource.paginator = pager; }
  }
  @ViewChild(MatSort) sort: MatSort;

  subscriptions: Subscription[] = [];
  numberOfMonth: string;

  isLoading = false;
  constructor(private variableService: PharmaConfigService, private productService: ProductService, private store: Store<CoreState>) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    const initResponse =  await this.variableService.loadVariable("EXPIRE_ON").toPromise();
    if(initResponse.errorCode === 2){
      this.store.dispatch(onNotificationMessage({msgType:"ERROR", msg: initResponse.errorMessage}));
      this.isLoading = false;
      return ;
    }
    this.numberOfMonth = initResponse.variableValue;
    const resp =  await this.productService.loadProductsThatAreAboutToExpire(this.numberOfMonth).toPromise();
    this.dataSource = new MatTableDataSource<ProductsAboutToExpire>(resp.productsAboutToExpire);
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }


}
