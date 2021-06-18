import {Component, Input, OnInit} from '@angular/core';
import * as shape from 'd3-shape';
@Component({
  selector: 'app-product-purchase',
  templateUrl: './product-purchase.component.html',
  styleUrls: ['./product-purchase.component.scss']
})
export class ProductPurchaseComponent implements OnInit {

  @Input()
  data: any[];
  view: any[] = [1200, 450];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mois';
  showYAxisLabel = true;
  yAxisLabel = 'Achat';
  legendTitle = 'Produits';


  colorScheme = {
    domain:   ['#904505','#5e8041','#20390b','#cd4aa8','#e2dfd0','#88eb59','#967484','#bef12d',
      '#fc36d9','#d0ff7c','#bfdb91','#fe3812','#fc52ce','#d31ad6','#49fb58','#48845f','#1ec7ee',
      '#172385','#01ba70','#48845f','#1ec7ee','#172385','#01ba70','#6982a5','#6982a5','#a8d891',
      '#a21a7a','#fb3485','#85cdd8','#b1d610','#be31cd']
  };
  constructor() { }

  ngOnInit(): void {
  }

}
