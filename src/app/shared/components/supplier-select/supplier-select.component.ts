import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SupplierWem} from "../../../core/models";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-supplier-select',
  templateUrl: './supplier-select.component.html',
  styleUrls: ['./supplier-select.component.scss']
})
export class SupplierSelectComponent implements OnInit {

  @Input()
  suppliers: SupplierWem[] = [];

  supplierCtrl = new FormControl();
  @Output()
  onSupplierSelected: EventEmitter<SupplierWem> = new EventEmitter<SupplierWem>();

  constructor() { }

  ngOnInit(): void {
    this.supplierCtrl.valueChanges.subscribe(s => {
      this.onSupplierSelected.emit(s);
    })
  }


}
