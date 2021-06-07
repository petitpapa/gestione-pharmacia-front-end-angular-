import { Component, OnInit, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { MessageType, Product } from "../../core/models";
import { addItem, removeItem, updateItemPrice, clearCart } from "../store/cart.actions";
import {
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
  selectCustomer,
} from "../store/cart.selector";
import {
  CreateOrderRequest,
  OrderLineItem,
} from "../../core/models/create.order.request";
import { MatDialog } from "@angular/material/dialog";
import { OrderConfirmationDialogComponent } from "./order-confirmation-dialog/order-confirmation-dialog.component";
import { VentesService } from "../../core/services";
import { CoreState } from "../../core/store/core.reducer";
import { onNotificationMessage } from "../../core/store/core.actions";
import { Router } from "@angular/router";
@Component({
  selector: "app-shopping-cart",
  templateUrl: "./shopping-cart.component.html",
  styleUrls: ["./shopping-cart.component.scss"],
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cartItems$ = this.store.pipe(select(selectCartItems));
  numberOfItems = this.store.pipe(select(selectCartItemsCount));
  total = this.store.pipe(select(selectCartTotal));
  selectedCustomer$ = this.store.pipe(select(selectCustomer));

  customerId: number;
  totalOrder: number;
  totalPaid = 0;
  products: Product[];
  subscriptions$: Subscription[] = [];
  orderConfirmation = false;

  constructor(
    private store: Store<CoreState>,
    public dialog: MatDialog,
    private orderService: VentesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const customerIdsubscription = this.selectedCustomer$.subscribe(
      (cus) => (this.customerId = cus.customerId)
    );
    const totalOrderSubscription = this.total.subscribe(
      (res) => (this.totalOrder = res)
    );
    const productsSubscription = this.cartItems$.subscribe(
      (items) => (this.products = items)
    );
    this.subscriptions$.push(customerIdsubscription);
    this.subscriptions$.push(totalOrderSubscription);
    this.subscriptions$.push(productsSubscription);
  }

  removeItem(item: Product): void {
    this.store.dispatch(removeItem({ item }));
  }

  addItem(item: Product): void {
    this.store.dispatch(addItem({ item }));
  }

  onAddItemEvent(item: Product): void {
    this.addItem(item);
  }

  onRemoveItemEvent(item: Product): void {
    this.removeItem(item);
  }

  async createOrder(): Promise<void> {
    const items: OrderLineItem[] = this.products.map((p) => {
      return {
        productId: p.id,
        quantity: p.quantityToCmd,
        remise: p.remise,
        price: p.price,
      };
    });

    const dialogRef = this.dialog.open(OrderConfirmationDialogComponent, {
      width: "650px",
    });
    const a = await dialogRef.afterClosed().toPromise();
    const orderRequest: CreateOrderRequest = {
      customerId: this.customerId,
      totalOrder: this.totalOrder,
      totalPaid: a.paid,
      orderLineItem: items,
      invoiceHistory: { amountPaid: a.paid, notes: a.notes },
    };

    await this.createOrdrAndHandleResponse(orderRequest);
    this.store.dispatch(clearCart());
    this.router.navigateByUrl('/ventes/ventes-produits');
  }

  private async createOrdrAndHandleResponse(orderRequest: CreateOrderRequest) {
    const res = await this.orderService.createOrder(orderRequest).toPromise();
    if (res?.errorCode === 2) this.dispatchError(res);
    else if (res?.errorCode === 0) this.onSuccess();
  }

  private onSuccess() {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.SUCCESS,
        msg: "La vente a éte enregistrée avec succes",
      })
    );
  }

  onRemiseEvent(event): void {
    this.store.dispatch(
      updateItemPrice({ item: event.item, remise: event.remise })
    );
  }

  private dispatchError(res: any): void {
    this.store.dispatch(
      onNotificationMessage({
        msgType: MessageType.ERROR,
        msg: "Une erreur c est produite: ".concat(res.errorMessage),
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((subs) => {
      subs.unsubscribe();
    });
  }
}
