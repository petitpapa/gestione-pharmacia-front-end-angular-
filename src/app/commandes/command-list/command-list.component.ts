import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { MessageType } from "../../core/models";
import { CommandsService } from "../../core/services";
import { onNotificationMessage } from "../../core/store/core.actions";
import { CoreState } from "../../core/store/core.reducer";
import * as _ from "lodash-es";
@Component({
  selector: "app-command-list",
  templateUrl: "./command-list.component.html",
  styleUrls: ["./command-list.component.scss"],
})
export class CommandListComponent implements OnInit, OnDestroy {
  isLoading = false;
  suppliers: any[];
  displayedColumns: string[] = [
    "supplierName",
    "date",
    "bl",
    "form",
    "productName",
    "qty",
    "ppv",
    "expiryDate",
  ];
  dataSource: MatTableDataSource<any>;

  @ViewChild("blPaginator") set blPaginator(pager: MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  startDate = new Date();
  endDate = new Date();

  subscription: Subscription;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  period: FormGroup;

  constructor(
    private commandService: CommandsService,
    private store: Store<CoreState>
  ) {
    this.period = new FormGroup({
      start: new FormControl(this.startDate),
      end: new FormControl(this.endDate),
    });
  }

  ngOnInit(): void {
    this.loadBLCommand();
  }

  private loadBLCommand() {
    this.isLoading = true;
    this.subscription = this.commandService
      .loadCommandMaded(this.startDate, this.endDate)
      .subscribe((response) => {
        this.isLoading = false;
        if (response?.errorCode === 2) {
          this.store.dispatch(
            onNotificationMessage({
              msgType: MessageType.ERROR,
              msg: "Erreur".concat(response?.errorMessage),
            })
          );
        } else {
          const commands: any[] = response?.commands;
          this.dataSource = new MatTableDataSource<any>(commands);
          // this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.suppliers = _.map(
            _.uniqBy(commands, (c) => c?.supplierId),
            (s) => {
              return { id: s?.supplierId, name: s?.supplierName };
            }
          );
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  reload(): void {
    this.startDate = this.period.controls.start.value;
    this.endDate = this.period.controls.end.value;
    if (this.startDate === null || this.startDate === undefined)
      this.startDate = new Date();
    if (this.endDate === null || this.endDate === undefined)
      this.endDate = new Date();
    this.loadBLCommand();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
