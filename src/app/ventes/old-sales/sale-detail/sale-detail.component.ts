import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sale-detail',
  templateUrl: './sale-detail.component.html',
  styleUrls: ['./sale-detail.component.scss']
})
export class SaleDetailComponent implements OnInit {
  @Input()
  detailsDataSource;
  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.detailsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.detailsDataSource.paginator) {
      this.detailsDataSource.paginator.firstPage();
    }
  }

}
