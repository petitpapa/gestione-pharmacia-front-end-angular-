import { CommandItem } from '../../core/models/command.response';
import * as _ from 'lodash-es';
import { SellingPriceModel } from '../../core/models';
export class InvoiceCalculatore {

  static totalSalePrice(items: CommandItem[]): number {
    const salesPrice: number[] = _.map(items, (i: CommandItem) => i.unitSalePrice * i.commandQuantity);
    return _.reduce(salesPrice, function (sum: number, s) { return sum + Number(s); }, 0);
  }

  static totalOfInvoice(items: CommandItem[]): number{
    const salesPrice: number[] = _.map(items, (i: CommandItem) => i.supplierPrice * i.commandQuantity);
    return _.reduce(salesPrice, function (sum: number, s) { return sum + Number(s); }, 0);
  }



  static totalPriceHT(items: CommandItem): number {
    return _.reduce(items, function (sum: number, item: CommandItem) { return sum + item.unitPriceHT; }, 0);
  }

  static calculateNetPurchaseCosts(purchaseCost: number, discount: number): number {
    return purchaseCost - discount;
  }

  static calculatePurchaseCosts(productPriceTTC: number, fraixAchat: number): number {
    return productPriceTTC + fraixAchat;
  }

  static calculateSellingPriceHT(coutAchat: number, coefficientDeMarge: number): number {
    return _.round(coutAchat * coefficientDeMarge, 2);
  }

  static calculateSellingPriceTTC(prixDeVente: number, tva: number): number {
    return _.round(prixDeVente * (1 + tva / 100), 2);
  }
  
  static applyDiscount(productPrice: number, discount:number): number{
    return _.round(productPrice * (1 - discount / 100),2);
  }

  //----new methods ----
  static calculateSalePrice(saleRequest: SellingPriceModel): number {
    return _.round(saleRequest.productPrice * (1 + saleRequest.tva / 100) * saleRequest.multiplicator + saleRequest.fee,2);
  }

  static calculateUnitPrice(productPrice: number, tva: number): number {
    return _.round(productPrice * (1 + tva / 100), 2);
  }


}