import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Customer, MessageType, Product } from "../../core/models";
import { VentesService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { addCustomer, addItem, clearCart } from "../store/cart.actions";
import { ShoppingCart } from "../store/cart.reducer";
import { AddCustomerDialogComponent } from "./add-customer-dialog/add-customer-dialog.component";
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
  selectCustomer,
} from "../store/cart.selector";
import { Subscription } from "rxjs";
import {
  CreateOrderRequest,
  OrderLineItem,
} from "../../core/models/create.order.request";
import * as _ from "lodash-es";
import { ProductDetailDialogComponent } from "./product-detail-dialog/product-detail-dialog.component";
@Component({
  selector: "app-sales-products",
  templateUrl: "./sales-products.component.html",
  styleUrls: ["./sales-products.component.scss"],
})
export class SalesProductsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "id",
    "image",
    "Form",
    "Rayon",
    "name",
    "price",
    "quantity",
    "expiryDate",
    "actions",
  ];
  dataSource: MatTableDataSource<Product>;

  cartItems$ = this.store.pipe(select(selectCartItems));
  numberOfItems = this.store.pipe(select(selectCartItemsCount));
  total = this.store.pipe(select(selectCartTotal));
  isLoading = false;
  customers: Customer[];
  selectedCustomer$ = this.store.pipe(select(selectCustomer));
  subscriptions$: Subscription[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private saleService: VentesService,
    private store: Store<ShoppingCart>,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const productsForSaleSub = this.loadProductsForOrders();
    this.subscriptions$.push(productsForSaleSub);
  }

  private loadProductsForOrders() {
    this.isLoading = true;
    return this.saleService.loadProductsForSale().subscribe((res) => {
      if (res?.errorCode === 2) {
        this.dispatchError(res);
      } else {
        this.dataSource = new MatTableDataSource<Product>(
          res?.container.products
        );
        this.dataSource.paginator = this.paginator;
      }
      this.isLoading = false;
    });
  }

  private dispatchError(res: any): void {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: "Une erreur c est produite: ".concat(res.errorMessage),
      })
    );
  }

  formatImage(img: any): any {
    return "data:image/jpeg;base64," + img;
  }

  goToShoppingCart(): void {
    this.router.navigateByUrl("/ventes/panier");
  }

  addToShoppingCart(item: Product): void {
    this.store.dispatch(addItem({ item }));
  }

  openAddCustomerDialog(): void {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: "1200px",
    });

    const sub = dialogRef.afterClosed().subscribe((selectedCustomer) => {
      if (selectedCustomer) {
        this.store.dispatch(addCustomer({ customer: selectedCustomer }));
      }
    });
    this.subscriptions$.push(sub);
  }

  goToOldSales(): void {
    this.router.navigateByUrl("/ventes/ventes-passées");
  }

  async suspendSale(): Promise<void> {
    const orderRequest: CreateOrderRequest = {
      customerId: this.getCurrentCustomer(),
      totalOrder: this.getTotalSale(),
      totalPaid: 0,
      orderLineItem: this.mapProductToItems(),
    };

    const response = await this.saleService
      .suspendOrder(orderRequest)
      .toPromise();
    if (response.errorCode === 2) this.dispatchError(response);
    else {
      this.store.dispatch(
        onNotificationMessage({
          msgType: MessageType.SUCCESS,
          msg: "La vente a été suspendue",
        })
      );
      this.store.dispatch(clearCart());
    }
  }

  private getCurrentCustomer() {
    let customerId = -1;
    this.subscriptions$.push(
      this.selectedCustomer$.subscribe((c) => (customerId = c.customerId))
    );
    return customerId;
  }

  private getTotalSale() {
    let total = 0;
    this.subscriptions$.push(
      this.total.subscribe((t) => {
        total = t;
      })
    );
    return total;
  }

  private mapProductToItems(): OrderLineItem[] {
    return this.getProducts().map((p) => {
      return {
        productId: p.id,
        quantity: p.quantityToCmd,
        remise: p.remise,
        price: p.price,
      };
    });
  }

  private getProducts() {
    let products: Product[] = [];
    this.subscriptions$.push(
      this.cartItems$.subscribe((items) => {
        products = items;
      })
    );
    return products;
  }

  restoreSuspendedSales(): void {
    this.isLoading = true;
    const sub = this.saleService
      .loadSuspendedSales({ id: this.getCurrentCustomer() })
      .subscribe((res) => {
        if (res?.errorCode === 2) this.dispatchError(res);
        else {
          const items: any[] = res?.items;
          _.each(items, (toSearch) => {
            this.lookupDataSourceFor(toSearch);
          });
        }
        this.isLoading = false;
      });
    this.subscriptions$.push(sub);
  }

  private lookupDataSourceFor(toSearch: any) {
    _.each(this.dataSource.data, (item) => {
      if (this.foundedProductId(item, toSearch))
        this.addProductToCart(toSearch, item);
    });
  }

  private foundedProductId(item: any, toSearch: any) {
    return item.id === toSearch?.productId;
  }

  private addProductToCart(toSearch: any, item: any) {
    for (let time = 1; time <= toSearch.quantity; time++) {
      this.store.dispatch(addItem({ item: item }));
    }
  }
  openProductDetailDialog(product: Product): void {
    const dialogRef = this.dialog.open(ProductDetailDialogComponent, {
      width: "800px",
      data: { id: product.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
