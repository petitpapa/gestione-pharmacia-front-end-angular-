import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { MessageType } from '../../core/models/message.type';
import { CoreState } from '../../core/store/core.reducer';
import {SupplierWem} from '../../core/models/supplier.response';
import { SupplierService } from '../../core/services';
import * as fromCoreActions from '../../core/store/core.actions';
import { BaseResponse } from '../../core/models/base.wem';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {
   displayedColumns: string[] = ['delete', 'id', 'name', 'address', 'phoneNumber', 'codeIdentication'];

  fournisseurDataSource: MatTableDataSource<SupplierWem>;

  subscription$: Subscription[] = [];

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private service: SupplierService, private store: Store<CoreState>) { }

  nameFormControl = new FormControl('', [
    Validators.required,
  ])

  addressFormControl = new FormControl('', [
    Validators.required,
  ])

  phoneFormControl = new FormControl('', [
    Validators.required,
  ])

  form: FormGroup = new FormGroup({
    tel: new FormControl('')
  });

  completeMode = false;
  isLoading = false;

  editMode = false;

  toUpdate: SupplierWem = {
    id: Number.MAX_VALUE,
    name: '',
    address: '',
    phoneNumber: '',
    codeIdentification: ''
  };

  ngOnInit(): void {
    this.subscription$.push(this.loadFournisseurs());
  }

  loadFournisseurs() {
    this.isLoading = true;
    return this.service.loadFournisseurs().subscribe((data) => {
      const rayons = data.container.suppliers;
      this.fournisseurDataSource = new MatTableDataSource<SupplierWem>(rayons);
      this.fournisseurDataSource.sort = this.sort;
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.fournisseurDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscription$.forEach(sub => {
      if(sub){
        sub.unsubscribe();
      }
    })
  }

  modifyCurrentRow(element: SupplierWem) {

    this.editMode = true;
    this.toUpdate = { ...element };
  }

  update(element: SupplierWem) {
    this.updateRow(element);
    this.resetFprmControl();
    this.resetSelectedRow();
    this.editMode = false;
  }

  private resetSelectedRow() {
    this.toUpdate = {
      id: Number.MAX_VALUE,
      name: '',
      phoneNumber: '',
      address: '',
      codeIdentification: ''
    };
  }

  private updateRow(element: SupplierWem) {
    element.name = this.nameFormControl.value;
    element.address = this.addressFormControl.value;
    element.phoneNumber = this.phoneFormControl.value;
    const sub =  this.service.update(
      { id: element.id.toString(), name: element.name, address: element.address, codeIdentification: element.codeIdentification }
    ).subscribe((res: BaseResponse) => {
      if (res.wasSucced) this.store.dispatch(fromCoreActions.onNotificationMessage({ msgType: MessageType.SUCCESS, msg: 'Il fourisseur a été modifié avec success!' }))
    })
    this.subscription$.push(sub);
  }

  private resetFprmControl() {
    this.nameFormControl.reset('');
    this.addressFormControl.reset('');
    this.phoneFormControl.reset('');
  }

  cancel() {
    /*this.toUpdate.oldDescription*/
    this.toUpdate = { ...this.toUpdate, name: '' }
    this.editMode = false;
  }

  enableAddFournisseur(): void {
    this.completeMode = true;
  }
  cancelAddFournisseur(): void {
    this.completeMode = false;
  }
  addFournisseur(): void {
    //call service
    this.completeMode = false;
  }
  delete(id: number): void{
    this.service.remove(id.toString()).subscribe(res =>{
      if(res.errorCode === 2){
        this.store.dispatch(fromCoreActions.onNotificationMessage({ msgType: MessageType.ERROR, msg: res.errorMessage }))
      }else{
        this.store.dispatch(fromCoreActions.onNotificationMessage({ msgType: MessageType.SUCCESS, msg: 'Il fourisseur a été supprimé de la base de donnée' }))
      }
    })
  }

}
