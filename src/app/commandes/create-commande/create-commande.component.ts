import { Component, OnDestroy, OnInit } from "@angular/core";
import { MessageType } from "../../core/models/message.type";
import { onNotificationMessage } from "../../core/store/core.actions";
import { Product } from "../../core/models/product.response";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { CoreState } from "../../core/store/core.reducer";
import { CreateCommandDialogContainerComponent } from "../dialog/create-command-dialog-container/create-command-dialog-container.component";
import { ErrorStateMatcher } from "@angular/material/core";
import { Item } from "../../core/models/create.command.request";
import { CommandsService, SupplierService } from "../../core/services";
import { Subscription } from "rxjs";
import { SupplierWem } from "../../core/models/supplier.response";
import { Router } from "@angular/router";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

interface Filter {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-create-commande",
  templateUrl: "./create-commande.component.html",
  styleUrls: ["./create-commande.component.scss"],
})
export class CreateCommandeComponent implements OnInit, OnDestroy {
  fournisseurFormControl = new FormControl("", [Validators.required]);

  filters: Filter[] = [
    { value: "all", viewValue: "Tous les produits" },
    { value: "aboutToFinish", viewValue: "en rupture" },
    { value: "finished", viewValue: "stock épuisé" },
  ];

  fournisseurs: SupplierWem[] = [];

  subcripions$: Subscription[] = [];

  matcher = new MyErrorStateMatcher();

  toAdd: Product[] = [];

  constructor(
    public dialog: MatDialog,
    private supplierService: SupplierService,
    private cmdService: CommandsService,
    private store: Store<CoreState>,
    private router: Router
  ) {}

  ngOnInit(): void {
    const fournisseurs$ = this.loadFournisseurs();
    this.subcripions$.push(fournisseurs$);
  }

  loadFournisseurs() {
    return this.supplierService.loadFournisseurs().subscribe((data) => {
      this.fournisseurs = data.container.suppliers;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCommandDialogContainerComponent, {
      width: "800px",
    });

    dialogRef.afterClosed().subscribe((items: Product[]) => {
      if (items === undefined) return;
      if (this.toAdd === undefined) this.toAdd = [];
      this.initQty(items);
      if (this.toAdd.length == 0) {
        this.toAdd = items;
      } else {
        items.forEach((item) => {
          this.addNewProductIfNotFound(item);
        });
      }
    });
  }

  private addNewProductIfNotFound(item: Product) {
    const founded = this.toAdd.find((i) => i.id === item.id);
    if (founded === undefined) {
      this.toAdd.push(item);
    }
  }

  private initQty(items: Product[]) {
    items.forEach((item) => {
      item.quantityToCmd = 1;
    });
  }

  loadProductCommandes() {}

  removeFromCommand(product: Product): void{
    const founded = this.toAdd.findIndex((i) => i.id === product.id);
    if (founded !== -1) {
      this.toAdd.splice(founded, 1);
    }
  }

  formatImage(img: any): any {
    return "data:image/jpeg;base64," + img;
  }

  onSubmit(): void {
    const supplierId = this.fournisseurFormControl.value;
    const currentFournisseur = this.fournisseurs.find(
      (f) => f.id === supplierId
    );
    if (currentFournisseur === undefined) return;
    const items: Item[] = [];
    this.toAdd.forEach((p) => {
      items.push({
        productId: p.id.toString(),
        productName: p.name,
        quantityOrdered: p.quantityToCmd,
      });
    });
    const request = {
      supplierId: currentFournisseur.id.toString(),
      items: items,
    };
    this.cmdService.createNewCommand(request).subscribe((response) => {
      if (response.errorCode === 2) {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.ERROR,
            msg: "Une erreur c'est produite: " + response.errorMessage,
          })
        );
      } else {
        this.store.dispatch(
          onNotificationMessage({
            msgType: MessageType.SUCCESS,
            msg: "La commande a été enregistrée avec success!",
          })
        );
        this.router.navigateByUrl('/commandes/gestion-commande');
      }
    });
  }

  ngOnDestroy(): void {
    this.subcripions$.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
