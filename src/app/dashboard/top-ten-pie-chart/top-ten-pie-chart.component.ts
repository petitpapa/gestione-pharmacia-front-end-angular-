import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as shape from "d3-shape";

@Component({
  selector: 'app-top-ten-pie-chart',
  templateUrl: './top-ten-pie-chart.component.html',
  styleUrls: ['./top-ten-pie-chart.component.scss']
})
export class TopTenPieChartComponent implements OnInit{
  unitChart = true;
   single = [
    {
      "name": "ZEDITEN 1MG",
      "value": 10
    },
    {
      "name": "PARACETAMOL 500",
      "value": 25
    },
    {
      "name": "DOLIPRANE",
      "value": 3
    },
    {
      "name": "ACTIMEL",
      "value": 7
    },
    {
      "name": "CREME",
      "value": 11
    },{
      "name": "CORTISONE",
      "value": 8
    },{
      "name": "BETAMOL",
      "value": 1
    },{
      "name": "TRIPLE ACTION",
      "value": 10
    },{
      "name": "COMP",
      "value": 5
    },{
      "name": "PLASM",
      "value": 16
    }
  ];

  multi = [
    {
      "name": "année en cours",
      "series": [
        {
          "name": "paracetamol",
          "value": 62000000
        },
        {
          "name": "doliprane",
          "value": 73000000
        },
        {
          "name": "Betamine",
          "value": 89400000
        },
        {
          "name": "Betamine 45",
          "value": 85400000
        }
        , {
          "name": "spray",
          "value": 99400000
        }
        , {
          "name": "denoral",
          "value": 69400000
        }, {
          "name": "dercos",
          "value": 89600000
        }, {
          "name": "urgo",
          "value": 85400000
        }, {
          "name": "baume",
          "value": 77400000
        }, {
          "name": "menthe",
          "value": 89900000
        }
      ]
    },
    ]

  // saleDate
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'produits';
  yAxisLabel: string = 'total';
  timeline: boolean = true;
  linearCurve= shape.curveNatural;


  view: any[] = [700, 400];

  // options
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
 // showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: [ 'rgb(250, 180, 100)', '#bee6ff','#fa5032','#d0d0d0','#befabe','#fafa5a','#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  labelPosition: any;

  @ViewChild("unitBtn") btnField: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.btnField.nativeElement.focus();
  }



  showUnitChart() {
    this.unitChart = true;
  }

  showTotalSaleChart() {
    this.unitChart = false;
  }
}
