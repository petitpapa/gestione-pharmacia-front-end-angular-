import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RayonWem } from '../../core/models/rayons';
import {RayonsService} from '../../core/services/rayons/rayons.service';
@Component({
  selector: 'app-rayons',
  templateUrl: './rayons.component.html',
  styleUrls: ['./rayons.component.scss']
})
export class RayonsComponent implements OnInit {

  displayedColumns: string[] = ['id', 'description', 'codification'];

  rayonDataSource: MatTableDataSource<RayonWem>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  subscription$: Subscription;

  constructor(private service: RayonsService) { }

  ngOnInit(): void {
    this.subscription$ = this.loadRayons();
  }

  loadRayons() {
    return this.service.loadRayons().subscribe((data) => {
      const rayons = data.container.rayons;
      this.rayonDataSource = new MatTableDataSource<RayonWem>(rayons);
      this.rayonDataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rayonDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }

}
