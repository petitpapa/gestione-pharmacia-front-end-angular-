import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import {Product} from '../../../core/models/product.response';
import { CommandsService } from '../../../core/services';
@Component({
  selector: 'app-create-command-dialog-container',
  templateUrl: './create-command-dialog-container.component.html',
  styleUrls: ['./create-command-dialog-container.component.scss']
})
export class CreateCommandDialogContainerComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns: string[] = ['select', 'position', 'name', 'restant', 'seuil'];
  cmdDataSource = new MatTableDataSource<Product>(); //new MatTableDataSource<?>(ELEMENT_DATA);
  selection = new SelectionModel<Product>(true, []);

  subscriptions$: Subscription[] = [];
  isLoading = false;


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cmdServices: CommandsService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions$.push(
      this.cmdServices.productCommand().subscribe(productResponse => {
        const data = productResponse.container.products;
        this.cmdDataSource = new MatTableDataSource<Product>(data);
        this.cmdDataSource.paginator = this.paginator
        this.isLoading = false;
      })
    )

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.cmdDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.cmdDataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  applyFilter(event: Event): void{
    const filterValue = (event.target as HTMLInputElement).value;
    this.cmdDataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  ngAfterViewInit(): void{
    this.cmdDataSource.paginator = this.paginator;
  }

}
