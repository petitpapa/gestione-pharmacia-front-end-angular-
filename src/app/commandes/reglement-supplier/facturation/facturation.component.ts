import {Component, OnInit, ViewChild} from '@angular/core';
import {select, Store} from "@ngrx/store";
import {CoreState} from "../../../core/store/core.reducer";
import {Command, SupplierWem} from "../../../core/models";
import {getSupplierCommandReglement} from "../../store";
import {Subscription} from "rxjs";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@UntilDestroy({checkProperties: true})
@Component({
  selector: 'app-facturation',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.scss']
})
export class FacturationComponent implements OnInit {
  supplier: SupplierWem;
  commands: Command[];
  subscription: Subscription;

  displayedColumns: string[] = ['category', 'sum', 'avg'];
  dataSource: MatTableDataSource<Command>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private store: Store<CoreState>) { }

  ngOnInit(): void {
    this.subscription = this.store.select(getSupplierCommandReglement).subscribe( sc => {
      this.supplier = sc.supplier;
      this.dataSource = new MatTableDataSource<Command>(sc.cmds);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

}
