import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable, of, Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from "rxjs/operators";
import {StockagesService} from "../../../core/services/stockages.service";
import {Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {onNotificationMessage} from "../../../core/store/core.actions";
import {ProductService} from "../../../core/services/products/product.service";
import {PriceAndExpirationItem, ProductDetailResponse, ProductRow} from "../../../core/models";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-consultation-generale',
  templateUrl: './consultation-generale.component.html',
  styleUrls: ['./consultation-generale.component.scss']
})
export class ConsultationGeneraleComponent implements OnInit, OnDestroy, AfterViewInit {
  myControl = new FormControl();
  subscriptions$: Subscription[] = [];

  filteredOptions: any[] = [];
  productInfo: ProductDetailResponse;

  displayedColumns: string[] = ['date', 'price', 'qty'];
  dataSource = new MatTableDataSource<PriceAndExpirationItem>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private stockageService: StockagesService, private store: Store<CoreState>, private productService: ProductService) {
  }

  ngOnInit() {
    const searchText$ = this.myControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged()
    );

    const subAutoComplete = searchText$.pipe(
      switchMap(search => this.loadProducts(search))
    ).subscribe(res => {
      if (res?.errorCode === 2) {
        this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: res?.errorMessage}));
        return;
      }
      this.filteredOptions = res?.searchResults;

    });
    this.subscriptions$.push(subAutoComplete);
    this.myControl.valueChanges.subscribe(value => {
      const infoSub = this.productService.loadProductDetail(value.split('-')[0]).subscribe(res => {
        this.productInfo = res;
        this.dataSource.data = res?.priceAndExpirationItems;
      }, (error) => console.log(error));
      this.subscriptions$.push(infoSub);
    });
  }


  private loadProducts(search: any | string): Observable<any> {
    return this.stockageService.autoSearchProducts(search);
  }

  ngOnDestroy(): void {
    for (const subscriptions$Element of this.subscriptions$) {
      subscriptions$Element.unsubscribe();
    }
  }
}
