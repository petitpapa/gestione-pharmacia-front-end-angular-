import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Subscription} from "rxjs";
import {SupplierWem} from "../../../core/models";
import {select, Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {getSupplierCommandReglement} from "../../store";
import {map, take} from "rxjs/operators";
import {CommandsService} from "../../../core/services";
import {CommandHistory} from "../../../core/models/supplier.command.histories";
import {Location} from "@angular/common";
import {onNotificationMessage} from "../../../core/store/core.actions";

interface Filter{
  label: string,
  id: number
}

@Component({
  selector: 'app-facture-historique',
  templateUrl: './facture-historique.component.html',
  styleUrls: ['./facture-historique.component.scss']
})
export class FactureHistoriqueComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'expiryDate', 'salePrice', 'unitPriceHT', 'qty', 'total', 'status'];
  dataSource = new MatTableDataSource<CommandHistory>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isLoading = false;
  subscriptions: Subscription[] = [];

  commands: CommandHistory[] = [];

  selectedSupplier: SupplierWem;

  filters: Filter[] = [];

  constructor(private store: Store<CoreState>, private commandService: CommandsService, private location: Location) { }

  async ngOnInit(): Promise<void> {
    this.filters.push({id: 1, label:'produits avec remise'});
    this.selectedSupplier =  await this.store.pipe(select(getSupplierCommandReglement)).pipe(map(reglement => reglement.supplier), take(1)).toPromise();
    const res = await this.commandService.commandsHistories(this.selectedSupplier.id.toString()).toPromise();
    if (res.errorCode === 2) {
      this.store.dispatch(onNotificationMessage({msgType: "ERROR", msg: res?.errorMessage}));
      this.isLoading = false;
      return;
    }
    this.commands = res.commands;
    this.dataSource = new MatTableDataSource<CommandHistory>(res.commands);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  goBack() {
    this.location.back();
  }
}
