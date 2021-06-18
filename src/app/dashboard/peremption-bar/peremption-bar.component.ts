import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {PeriodicElement} from "../top-ten-table/top-ten-table.component";

@Component({
  selector: 'app-peremption-bar',
  templateUrl: './peremption-bar.component.html',
  styleUrls: ['./peremption-bar.component.scss']
})
export class PeremptionBarComponent implements OnInit, AfterViewInit {

  peremption =

    [
      {
        "name": "2021-06",
        "value": 20
      },
      {
        "name": "2021-07",
        "value": 10
      },
      {
        "name": "2021-09",
        "value": 25
      },
      {
        "name": "2021-08",
        "value": 18
      },
      {
        "name": "2021-10",
        "value": 5
      }
    ];

  xAxisLabel = 'Année/Mois';
  yAxisLabel = 'Nbr Produits';
  colorScheme = {
    domain: ['rgb(250, 180, 100)', '#bee6ff', '#fa5032', '#d0d0d0', '#befabe', '#fafa5a', '#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  view: any[] = [330, 180];

  displayedColumns: string[] = [ 'name', 'date'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }


}


const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

