import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {ReturnedProduct, ReturnedProductResponse} from "../../core/models/product.return.response";
import {CommandsService} from "../../core/services";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {onNotificationMessage} from "../../core/store/core.actions";
import {MessageType} from "../../core/models";
import {Store} from "@ngrx/store";
import {CoreState} from "../../core/store/core.reducer";

@Component({
  selector: 'app-consultation-avoir-recu',
  templateUrl: './consultation-avoir-recu.component.html',
  styleUrls: ['./consultation-avoir-recu.component.scss']
})
export class ConsultationAvoirRecuComponent implements OnInit, OnDestroy {
  subscription$: Subscription;

  dataSource = new MatTableDataSource<ReturnedProduct>();

  displayedColumns: string[] = ['position','productName', 'form', 'dateOfIssue',  'description', 'reason'];
  private isLoading: boolean;

  @ViewChild("responseAvoirsProcessedPaginator") set responseAvoirsProcessedPaginator(
    pager: MatPaginator
  ) {
    if (pager) this.dataSource.paginator = pager;
  }

  constructor(private cmdService: CommandsService, private store: Store<CoreState>) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.subscription$ = this.loadData().subscribe(response => {
      if (response?.errorCode === 2) {
        this.store.dispatch(onNotificationMessage({msgType: MessageType.ERROR, msg: response?.errorMessage}));
      } else {
        this.dataSource.data = response.returnedProducts;
      }
      this.isLoading = false;
    });
  }

  loadData(): Observable<ReturnedProductResponse> {
    return this.cmdService.loadProductReturnAllReadyProcessed();
  }

  ngOnDestroy(): void {
    if (this.subscription$)
      this.subscription$.unsubscribe();
  }

}
