import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-facture-dialog',
  templateUrl: './facture-dialog.component.html',
  styleUrls: ['./facture-dialog.component.scss']
})
export class FactureDialogComponent {
  factureFormControl = new FormControl('', [
    Validators.required]);
  matcher = new MyErrorStateMatcher();
  factureDateCtrl = new FormControl(new Date());
  constructor(
    public dialogRef: MatDialogRef<FactureDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  emitFactureData() {
    if (this.factureFormControl.valid) {
      this.dialogRef.close( {validateFacture:{factureNumber: this.factureFormControl.value, factureDate: this.factureDateCtrl.value}});
      this.factureFormControl.setValue("");
      this.factureDateCtrl.setValue(new Date());

    }
  }
}
