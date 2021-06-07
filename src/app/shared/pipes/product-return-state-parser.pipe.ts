import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'productReturnStateParser'
})
export class ProductReturnStateParserPipe implements PipeTransform {

  transform(value: string): string {

    switch (value) {
      case 'WAITING_SUPPLIER_RESPONSE':
        return 'En attente de response';
      case 'SUSPENDED':
        return 'Suspendue';
      case 'ACCEPTED_AND_RETURNED':
        return 'Partielement accepté';
      case 'ACCEPTED':
        return 'Accepté par le fournisseur';
      default:
        return 'Etat inconnu'
    }

  }

}
