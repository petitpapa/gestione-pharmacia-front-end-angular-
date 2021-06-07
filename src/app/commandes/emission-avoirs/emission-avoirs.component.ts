import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {Command, MessageType, SupplierWem} from "../../core/models";
import {CommandsService} from "../../core/services";
import {onNotificationMessage} from "../../core/store/core.actions";
import {CoreState} from "../../core/store/core.reducer";
import * as _ from "lodash-es";

interface Avoir {
  productId: number;
  productForm: string;
  productName: string;
  salePrice: number;
  emittedQty: number;
  productExpiryDate: string;
  reason: string;
  unitPriceHT: number,
  supplierId?: number,
  supplierName?: string,
  dateOfIssue: string,
  commandId: number
}



@Component({
  selector: "app-emission-avoirs",
  templateUrl: "./emission-avoirs.component.html",
  styleUrls: ["./emission-avoirs.component.scss"],
})
export class EmissionAvoirsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    "supplierName",
    "date",
    "bl",
    "form",
    "productName",
    "qty",
    "ppv",
    "expiryDate",
    "action",
  ];
  dataSource: MatTableDataSource<any>;

  originalCommands: Command[]

  isLoading = false;
  subscriptions: Subscription[] = [];
  period: FormGroup;

  @ViewChild("emissionAvoirsPaginator") set emissionAvoirsPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  startDate = new Date(1970, 11, 24);
  endDate = new Date(9999, 11, 24);
  issueDate = new Date();
  issueDateCtrl = new FormControl(this.issueDate);

  total = 0;

  suppliers: SupplierWem[] = [];

  constructor(
    private commandService: CommandsService,
    private store: Store<CoreState>
  ) {
    this.period = new FormGroup({
      start: new FormControl(this.startDate),
      end: new FormControl(this.endDate),
    });
  }

  selectedProducts: Avoir[] = [];
  selectedSupplier: SupplierWem;

  ngOnInit(): void {
    this.loadBLCommand();
  }

  private loadBLCommand() {
    this.isLoading = true;
    this.subscriptions.push( this.commandService
      .loadCommandMaded(this.startDate, this.endDate)
      .subscribe((response) => {
        this.isLoading = false;
        if (response?.errorCode === 2) {
          this.store.dispatch(
            onNotificationMessage({
              msgType: MessageType.ERROR,
              msg: "Erreur ".concat(response?.errorMessage)
            })
          );
        } else {
          const commands: any[] = response?.commands;
          this.suppliers = _.uniqBy(_.map(commands, (c) => {
            return {id: c.supplierId, name: c.supplierName};
          }), 'id');
          this.dataSource = new MatTableDataSource<any>(commands);
          this.originalCommands = commands;
          this.dataSource.sort = this.sort;
        }
      }));
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addToCart(product): void {
    const avoir: Avoir = {
      productId: product.productId,
      productForm: product.productForm,
      productExpiryDate: product.expiryDate,
      salePrice: product.salePrice,
      emittedQty: 1,
      productName: product.productName,
      reason: "",
      unitPriceHT: product.unitPriceHT,
      commandId: product.commandId,
      dateOfIssue: this.issueDate.toString()
    };
    const foundedItem = _.find(
      this.selectedProducts,
      (p) => p.productId === product.productId
    );
    if (foundedItem) {
      foundedItem.emittedQty += 1;
    } else this.selectedProducts.push(avoir);
  }

  addItem(item: Avoir): void {
    item.emittedQty += 1;
  }

  removeItem(item: Avoir): void {
    item.emittedQty -= 1;
    if (item.emittedQty === 0) {
      _.remove(this.selectedProducts, (p: Avoir) => p.productId === item.productId);
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = _.reduce(_.map(this.selectedProducts, (p: Avoir) => p.emittedQty * p.unitPriceHT), (sum: number, n: number) => sum + n, 0);
  }

  sendProductReturn(): void {
    _.map(this.selectedProducts, p => {
      p.supplierId = this.selectedSupplier.id;
      p.supplierName = this.selectedSupplier.name;
      p.dateOfIssue = this.issueDateCtrl.value;

      return p;
    });
    const subs$ = this.commandService.sendReturnedProduct(this.selectedProducts).subscribe((response) => {

      if (response?.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c est produite: ".concat(response.errorMessage),
          })
        );
      }
      if(response?.errorCode === 0) {
        this.store.dispatch( onNotificationMessage({
          msgType: MessageType.SUCCESS,
          msg: "Enregistrer avec succes",
        }));
        this.selectedProducts = [];
      }
    });
    this.subscriptions.push(subs$);
  }


  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  loadReturnedProductOfSupplier(supplier: SupplierWem) {
    this.selectedSupplier = supplier;
    this.dataSource.data = this.originalCommands;
    this.dataSource.data = this.dataSource.data.filter(p => p.supplierId === supplier.id);
    this.selectedProducts = []
  }
}
