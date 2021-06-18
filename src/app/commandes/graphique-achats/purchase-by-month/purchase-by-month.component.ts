import { Component, OnInit } from '@angular/core';
import * as shape from "d3-shape";



@Component({
  selector: 'app-purchase-by-month',
  templateUrl: './purchase-by-month.component.html',
  styleUrls: ['./purchase-by-month.component.scss']
})
export class PurchaseByMonthComponent implements OnInit {
  saleData = [
    {
      "name": "Année en cours",
      "series": [
        {
          "name": "2021-01",
          "value": 62000000
        },
        {
          "name": "2021-02",
          "value": 73000000
        },
        {
          "name": "2021-03",
          "value": 89400000
        },
        {
          "name": "2021-04",
          "value": 69400000
        },
        {
          "name": "2021-05",
          "value": 99400000
        },
        {
          "name": "2021-06",
          "value": 119400000
        },
        {
          "name": "2021-07",
          "value": 319400000
        },
        {
          "name": "2021-08",
          "value": 19400000
        },
        {
          "name": "2021-09",
          "value": 19400000
        },
        {
          "name": "2021-10",
          "value": 139400000
        },
        {
          "name": "2021-11",
          "value": 119400000
        },
        {
          "name": "2021-12",
          "value": 118400000
        }
      ]
    },

    {
      "name": "Année precedente",
      "series": [
        {
          "name": "2021-01",
          "value": 52000000
        },
        {
          "name": "2021-02",
          "value": 63000000
        },
        {
          "name": "2021-03",
          "value": 99400000
        },
        {
          "name": "2021-04",
          "value": 79400000
        },
        {
          "name": "2021-05",
          "value": 49400000
        },
        {
          "name": "2021-06",
          "value": 109400000
        },
        {
          "name": "2021-07",
          "value": 119400000
        },
        {
          "name": "2021-08",
          "value": 14400000
        },
        {
          "name": "2021-09",
          "value": 18400000
        },
        {
          "name": "2021-10",
          "value": 129400000
        },
        {
          "name": "2021-11",
          "value": 18400000
        },
        {
          "name": "2021-12",
          "value": 218400000
        }
      ]
    },
  ];

  multi: any[];
  view: any[] = [1200, 450];

  // options for purchase by month
  legend = true;
  showLabels = true;
  animations = true;
  xAxis = true;
  yAxis = true;
  showYAxisLabel = true;
  showXAxisLabel = true;
  xAxisLabel = 'Mois';
  yAxisLabel = 'achat';
  timeline = true;
  linearCurve= shape.curveNatural;

  colorSchemePurchase = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() { }

  ngOnInit(): void {
  }

}
