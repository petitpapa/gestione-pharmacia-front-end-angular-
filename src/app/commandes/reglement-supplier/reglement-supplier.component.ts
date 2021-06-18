import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit, ViewChild,
} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {
  Command,
  CommandAvoirResponse, MessageType,
  SupplierResponse,
  SupplierWem,
} from "../../core/models";
import {CommandsService, SupplierService} from "../../core/services";
import {Observable, Subscription} from "rxjs";
import {untilDestroyed, UntilDestroy} from "@ngneat/until-destroy";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {CoreState} from "../../core/store/core.reducer";
import {Store} from "@ngrx/store";
import {onNotificationMessage} from "../../core/store/core.actions";
import {addReglementSupplier} from "../store/command.action";
import {MatDialog} from "@angular/material/dialog";
import {FactureDialogComponent} from "./facture-dialog/facture-dialog.component";

@UntilDestroy()
@Component({
  selector: "app-reglement-supplier",
  templateUrl: "./reglement-supplier.component.html",
  styleUrls: ["./reglement-supplier.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglementSupplierComponent implements OnInit, OnDestroy {
  suppliers$: Observable<SupplierResponse>;
  subscriptions$: Subscription[] = [];

  commandsAvoirs: CommandAvoirResponse;

  startDate: Date;
  endDate: Date;
  private campaignOne: FormGroup;
  selectedSuplier: SupplierWem;

  displayedColumns: string[] = ['BlOrAv', 'BlNumber', 'PPV', 'Remise'];
  dataSource: MatTableDataSource<Command>;

  isLoading = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private supplierService: SupplierService,
    private commandService: CommandsService,
    private router: Router,
    private store: Store<CoreState>
  ) {

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDay();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, day)),
      end: new FormControl(new Date(year, month, day)),
    });

    this.subscriptions$.push(this.campaignOne
      .get("start")
      .valueChanges.subscribe((s) => (this.startDate = s)));
    this.subscriptions$.push(this.campaignOne
      .get("end")
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((e) => {
        this.endDate = e;
        this.endDateChanged();
      }));
  }

  ngOnInit(): void {
    this.suppliers$ = this.supplierService.loadFournisseurs();
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions$) {
      subscription.unsubscribe();
    }
  }

  loadBLAndAvoirOfSupplier(supplier: SupplierWem): void {
    this.selectedSuplier = supplier;
    this.endDateChanged();
  }

  endDateChanged(): void {
    if (this.endDate !== null && this.endDate && this.selectedSuplier) {
      const comdsSub = this.commandService
        .loadCommandAndAvoirs({
          dateRange: {
            startDate: this.startDate,
            endDate: this.endDate,
          },
          supplierId: this.selectedSuplier.id,
        })
        .subscribe((res) => {
          if(res.errorCode === 2) {
            this.store.dispatch(
              onNotificationMessage({
                msgType: MessageType.ERROR,
                msg: "Une erreur c est produite: " + res.errorMessage,
              })
            );
            this.isLoading = false;
            return;
          }
          this.commandsAvoirs = res;
          this.dataSource = new MatTableDataSource<Command>(res.commands);
          this.dataSource.paginator = this.paginator;
          this.isLoading = false;
        });
      this.subscriptions$.push(comdsSub);
    }
  }

  startDateChanged(startDate: Date): void {
    this.startDate = startDate;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToFacturation() {
    if (this.selectedSuplier) {
      this.store.dispatch(addReglementSupplier({supplierCommand:{supplier: this.selectedSuplier, command: this.dataSource.data}}));
      this.router.navigate(['commandes/reglement-fournisseur/facturation']);
    }
  }

  goToRemise() {

  }

  goToHistorique() {
    if (this.selectedSuplier) {
      this.store.dispatch(addReglementSupplier({supplierCommand: {supplier: this.selectedSuplier, command: []}}));
      this.router.navigateByUrl('commandes/reglement-fournisseur/historiques');
    }
  }

}
