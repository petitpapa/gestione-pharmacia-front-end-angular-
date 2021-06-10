import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {SupplierWem} from "../../../core/models";
import {getSupplierCommandReglement} from "../../store";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {map, take} from "rxjs/operators";
import {CommandsService} from "../../../core/services";
import {onNotificationMessage} from "../../../core/store/core.actions";
import {FactureByCategoryWem} from "../../../core/models/facture.by.category.response";
import {Router} from "@angular/router";
import {Location} from "@angular/common";
import {FactureDialogComponent} from "../facture-dialog/facture-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.scss']
})
export class FacturationComponent implements OnInit, OnDestroy {
  supplier: SupplierWem;
  //commands: Command[];

  displayedColumns: string[] = ['category', 'sum', 'avg'];
  dataSource = new MatTableDataSource<FactureByCategoryWem>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(private store: Store<CoreState>, private commansService: CommandsService,
              private location: Location, public dialog: MatDialog, private router: Router) {
  }

  async ngOnInit() {
    this.isLoading = true;
    this.supplier = await this.store.pipe(select(getSupplierCommandReglement)).pipe(map(reglement => reglement.supplier), take(1)).toPromise();
    const sc = await this.commansService.loadSupplierFactureByCategory(this.supplier.id.toString()).toPromise();

    if (sc.errorCode === 2) {
      this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: sc?.errorMessage}));
      this.isLoading = false;
      return;
    }
    this.dataSource.data = sc.factures;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isLoading = false;
  }


  getTotalSum() {
    return this.dataSource.data.map(t => t.sum).reduce((acc, value) => acc + value, 0);
  }

  getTotalAvg() {
    return this.dataSource.data.map(t => t.avg).reduce((acc, value) => acc + value, 0);
  }

  goBack() {
    this.location.back();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FactureDialogComponent, {
      width: '850px',
    });

    const sub = dialogRef.afterClosed().subscribe(result => {
      let hasError = true;
      if (result.validateFacture) {
        console.log(result.validateFacture);
        const subs = this.commansService.validateFacture(
          {
            commands: this.dataSource.data.map(c => c.commandId),
            factureDate: result.validateFacture.factureDate,
            factureNumber: result.validateFacture.factureNumber.toUpperCase(),
            amount: this.getTotalSum()
          }).subscribe(res => {
          if (res.errorCode === 2)
            this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: res?.errorMessage}));
          if (res.errorCode === 0) {
            this.store.dispatch(onNotificationMessage({msgType: "SUCCESS", msg: "Enregistrer avec SUCCESS"}));
            hasError = false;
          }
        });
        this.subscriptions.push(subs);
        if (!hasError)
          this.router.navigateByUrl('/commandes/reglement-fournisseur');
      }
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}
