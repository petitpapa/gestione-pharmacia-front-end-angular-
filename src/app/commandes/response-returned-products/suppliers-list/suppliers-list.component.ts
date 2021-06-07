import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {SupplierWem} from "../../../core/models";
import {CommandsService} from "../../../core/services";

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {
  @Input()
  supplier: SupplierWem

  @Output()
  onSupplierId: EventEmitter<number> = new EventEmitter();

  constructor(private commandService: CommandsService) {
  }

  ngOnInit(): void {
  }

  loadAllProduct():void{
    this.onSupplierId.emit(this.supplier.id);
  }

}
