import {Component, OnDestroy, OnInit} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {Subscription} from "rxjs";
import {
  CoefficientWem,
  CommandContainer,
  CommandItem,
  MessageType,
} from "../../core/models";
import {CoreState} from "../../core/store/core.reducer";
import {getSelectedCommand} from "../store/command.selectors";
import {
  onUpdateCommandItem,
  onAddCommandItem,
  onUpdateCommandProperties,
} from "../store/command.action";
import {InvoiceCalculatore} from "./invoice.calculator";
import {FileUploaderUtils} from "./FileUploader";
import {CommandsService} from "../../core/services";
import * as _ from "lodash-es";
import {momentForDate, Utils} from "../../core/utils";
import {onNotificationMessage} from "../../core/store/core.actions";
import {Router} from "@angular/router";

@Component({
  selector: "app-command-reception",
  templateUrl: "./command-reception.component.html",
  styleUrls: ["./command-reception.component.scss"],
})
export class CommandReceptionComponent implements OnInit, OnDestroy {
  selectedCommand: CommandContainer;
  subscriptions: Subscription[] = [];

  productFormGroup: FormGroup;
  priceFormGroup: FormGroup;
  commandFormGroup: FormGroup;

  selectedCoefficient = 1.1;
  selectedSupplierPrice = 0;
  discount = 0;
  fees = 0;
  tva = 0;
  margin = 0;

  coefficients: CoefficientWem[] = [];

  productToFillForReception: CommandItem = undefined;

  totalSalePrice = 0;
  totalInvoice = 0;
  tvaCtrl = new FormControl("", {updateOn: "blur"});
  supplierPriceCtrl = new FormControl("", {
    validators: [Validators.required],
    updateOn: "blur",
  });
  marginCtrl = new FormControl("", {
    validators: [Validators.required],
    updateOn: "blur",
  });
  priceUnitTTCtrl = new FormControl("", Validators.required);
  feeCtrl = new FormControl("", {updateOn: "blur"});
  discountCtrl = new FormControl("", {updateOn: "blur"});
  priceWithTvaAppliedCtrl = new FormControl("", {
    validators: [Validators.required],
    updateOn: "blur",
  });
  itemsFilled = {};
  numberOfItemsFilled = 0;

  numberOfItems$;

  files: any[] = [];

  constructor(
    private store: Store<CoreState>,
    private _formBuilder: FormBuilder,
    private service: CommandsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.onSupplierPriceChange();
    this.onFeeChange();
    this.onDiscountChange();
    this.onTvaChange();
    this.onMarginChange();

    const coefSub = this.service.loadCoefficients().subscribe((cm) => {
      this.coefficients = cm.container.coefficients;
    });
    this.subscriptions.push(coefSub);
    this.initProductForm();

    this.initPriceForm();

    this.initCommandForm();

    const cmdSubscription = this.store
      .pipe(select(getSelectedCommand))
      .subscribe((c) => {
        this.selectedCommand = c;
        this.numberOfItems$ = this.selectedCommand.items.length;
      });
    this.subscriptions.push(cmdSubscription);
  }

  private onSupplierPriceChange() {
    const sub = this.supplierPriceCtrl.valueChanges.subscribe((newPrice) => {
      this.selectedSupplierPrice = newPrice;
      this.updateUnitPriceTTC();
      this.calculateTotalInvoice();
      this.calculateTotalPriceSale();
    });
    this.subscriptions.push(sub);
  }

  private onTvaChange() {
    const sub = this.tvaCtrl.valueChanges.subscribe((newTva) => {
      this.tva = newTva;
      this.updateUnitPriceTTC();
      this.calculateTotalInvoice();
      this.calculateTotalPriceSale();
    });
    this.subscriptions.push(sub);
  }

  private onFeeChange() {
    const sub = this.feeCtrl.valueChanges.subscribe((newFee) => {
      this.fees = newFee;
      this.updateUnitPriceTTC();
      this.totalInvoice =  this.calculateTotalInvoice();
      this.totalSalePrice = this.calculateTotalPriceSale();
    });
    this.subscriptions.push(sub);
  }

  private onDiscountChange() {
    const sub = this.discountCtrl.valueChanges.subscribe((newDiscount) => {
      this.discount = newDiscount;
      this.updateUnitPriceTTC();
      this.totalInvoice =  this.calculateTotalInvoice();
      this.totalSalePrice = this.calculateTotalPriceSale();
    });
    this.subscriptions.push(sub);
  }

  private onMarginChange() {
    const sub = this.marginCtrl.valueChanges.subscribe((newMargin) => {
      this.margin = newMargin;
      const salePrice = InvoiceCalculatore.calculateSalePrice({
        tva: this.tva,
        productPrice: this.selectedSupplierPrice,
        multiplicator: this.selectedCoefficient,
        margin: +this.margin
      });

      this.priceWithTvaAppliedCtrl.setValue(salePrice);

      this.totalInvoice =  this.calculateTotalInvoice();
      this.totalSalePrice = this.calculateTotalPriceSale();
    });
    this.subscriptions.push(sub);
  }

  private updateUnitPriceTTC() {
    const salePrice = InvoiceCalculatore.calculateSalePrice({
      tva: this.tva,
      productPrice: this.selectedSupplierPrice,
      multiplicator: this.selectedCoefficient,
      margin: +this.margin
    });

    this.priceUnitTTCtrl.setValue(
      _.round(
        InvoiceCalculatore.calculateUnitPrice(
          this.selectedSupplierPrice,
          this.tva
        ),
        2
      )
    );
    this.priceWithTvaAppliedCtrl.setValue(salePrice);
  }

  private initPriceForm() {
    this.priceFormGroup = this._formBuilder.group({
      tva: this.tvaCtrl,
      supplierPrice: this.supplierPriceCtrl,
      unitPriceTTC: this.priceUnitTTCtrl,
      unitSalePrice: this.priceWithTvaAppliedCtrl,
      discount: this.discountCtrl,
      margin: this.marginCtrl
    });
  }

  private initProductForm() {
    this.productFormGroup = this._formBuilder.group({
      commandQuantity: ["", Validators.required],
      expiryDate: new FormControl(new Date(), Validators.required),
    });
  }

  private initCommandForm() {
    this.commandFormGroup = this._formBuilder.group({
      deliveryDate: new FormControl(new Date(), Validators.required),
      invoiceNumber: ["", Validators.required],
      totalDiscount: this.discountCtrl,
    });
  }

  formatImage(img: any): any {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return "data:image/jpeg;base64," + img;
  }

  /**
   * on file drop handler
   */
  onFileDropped($event): void {
    this.convertFiles($event);
    FileUploaderUtils.uploadFilesSimulator(this.files, 0);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files): void {
    const formData = new FormData();
    formData.append("file", files[0]);
    this.convertFiles(files);
    FileUploaderUtils.uploadFilesSimulator(this.files, 0);
  }

  deleteFile(index: number): void {
    FileUploaderUtils.deleteFile(this.files, index);
  }

  prepareFilesList(files: Array<any>): void {
    this.convertFiles(files);
    FileUploaderUtils.uploadFilesSimulator(this.files, 0);
  }

  convertFiles(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      if (sub) sub.unsubscribe();
    }
  }

  receptionner(product: CommandItem): void {
    if (this.productToFillForReception) {
      this.initPriceForm();
      this.initPriceForm();
      this.initCommandForm();
    }
    this.productToFillForReception = product;
  }

  saveTemporaryValue(): void {
    const p = this.selectedCommand.items.find(
      (c) => c.productId === this.productToFillForReception.productId
    );

    const newItem: CommandItem = Object.assign(
      {},
      p,
      this.productFormGroup.value,
      this.priceFormGroup.value
    );
    newItem.priceMultiplicator = this.selectedCoefficient;
    this.store.dispatch(onUpdateCommandItem({item: newItem}));

    this.totalSalePrice = this.calculateTotalPriceSale();
    this.totalInvoice = this.calculateTotalInvoice();

    if (!this.isInFilledItem()) {
      this.itemsFilled[this.productToFillForReception.productId] = true;
      this.numberOfItemsFilled = _.keys(this.itemsFilled).length;
    }

    this.initFormGroup();
  }

  private isInFilledItem() {
    return this.productToFillForReception.productId in this.itemsFilled;
  }

  private initFormGroup() {
    this.productFormGroup.reset();
    this.priceFormGroup.reset();
    this.productFormGroup.clearValidators();
    this.priceFormGroup.clearValidators();
    this.commandFormGroup.clearValidators();
    this.commandFormGroup.reset();
  }

  calculateTotalPriceSale(): number {
    return _.round(
      InvoiceCalculatore.totalSalePrice(this.selectedCommand.items) ,
      2
    );
  }

  calculateTotalInvoice(): number {
    return _.round(
      //  InvoiceCalculatore.applyDiscount(
      InvoiceCalculatore.totalOfInvoice(this.selectedCommand.items)
      // this.discount)
      ,
      2
    );
  }

  validCommand(): void {
    this.store.dispatch(
      onUpdateCommandProperties({properties: this.commandFormGroup.value})
    );
    const items = this.selectedCommand.items.map((item) => {
      return this.createItemToSend(item);
    });

    const formData = new FormData();

    for (let index = 0; index < this.files.length; index++) {
      formData.append("files[]", this.files[index]);
    }

    formData.append("items", JSON.stringify(items));

    this.appendCommandInfo(formData);
    this.service.saveInvoice(formData).subscribe((res) => {
      if (res.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c est produite: " + res.errorMessage,
          })
        );
      } else {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.SUCCESS,
            msg: "La commande du fournisseur a été ajouté avec success!",
          })
        );
        this.router.navigateByUrl("/commandes/pointer-bon-commandes");
      }
    });
  }

  private appendCommandInfo(formData: FormData) {
    formData.append(
      "commandId",
      Utils.convertNumberTodefaultIfNull(this.selectedCommand.commandId)
    );
    formData.append(
      "deliveryDate", this.selectedCommand.deliveryDate.toISOString()
      /*this.dateToString(
        this.selectedCommand.deliveryDate.getDate(),
        this.selectedCommand.deliveryDate.getMonth(),
        this.selectedCommand.deliveryDate.getFullYear()
      )
*/
    );
    formData.append(
      "invoiceNumber",
      Utils.convertNumberTodefaultIfNull(this.selectedCommand.invoiceNumber)
    );
    formData.append("totalAmount", _.toString(this.totalInvoice));
    formData.append("supplierId", this.selectedCommand.supplierId);
    formData.append(
      "totalDiscount",
      Utils.convertNumberTodefaultIfNull(this.selectedCommand.commandId)
    );
    formData.append("fees", Utils.convertNumberTodefaultIfNull(this.fees));
  }

  private createItemToSend(item: CommandItem) {
    const filteredItem: any = {};
    filteredItem.productId = item.productId;
    filteredItem.discount = item.discount;
    filteredItem.commandQuantity = Utils.convertNumberTodefaultIfNull(
      item.commandQuantity
    );
    filteredItem.expiryDate = item.expiryDate; /*this.dateToString(
      item.expiryDate.getDate(),
      item.expiryDate.getMonth(),
      item.expiryDate.getFullYear()
    );*/
    filteredItem.priceMultiplicator = Utils.convertNumberTodefaultIfNull(
      this.selectedCoefficient
    );
    filteredItem.productName = item.productName;
    filteredItem.supplierPrice = Utils.convertNumberTodefaultIfNull(
      item.supplierPrice
    );
    filteredItem.tva = Utils.convertNumberTodefaultIfNull(item.tva);
    filteredItem.unitPriceTTC = Utils.convertNumberTodefaultIfNull(
      item.unitPriceTTC
    );
    filteredItem.unitPriceTTC = Utils.convertNumberTodefaultIfNull(
      InvoiceCalculatore.calculateSellingPriceTTC(item.unitPriceTTC, item.tva)
    );
    filteredItem.unitSalePrice = Utils.convertNumberTodefaultIfNull(
      item.unitSalePrice
    );
    filteredItem.margin = Utils.convertNumberTodefaultIfNull(item.margin);

    return filteredItem;
  }

  updatePriceIfAny(event: Event): void {
    const coefficientId = +(event.target as HTMLSelectElement).value;
    this.selectedCoefficient = this.getSelectedCoefficient(coefficientId);
    this.updateUnitPriceTTC();
  }

  getSelectedCoefficient(coefficientId: number): number {
    const foundedCoefficient = this.coefficients.find(
      (c) => c.id === coefficientId
    );
    return foundedCoefficient ? foundedCoefficient.coefficient : 1.1;
  }

  duplicateItem(item): void {
    this.store.dispatch(onAddCommandItem({item: item}));
    this.numberOfItems$ = this.selectedCommand.items.length;
  }

  dateToString(day: number, month: number, year: number): string {
    return _.toString(_.padStart(_.toString(day), 2, "0"))
      .concat("/")
      .concat(
        _.padStart(_.toString(month), 2, "0")
          .concat("/")
          .concat(_.toString(year))
      );
  }
}
