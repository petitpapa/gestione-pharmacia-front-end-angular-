import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CoreState } from '../store/core.reducer';
import {sidebarToggleState} from '../../core/store/core.selector';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  isExpanded = false;
  width = 10;
  sidebarState: boolean;
  subscription: Subscription;

  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor(private store: Store<CoreState>) { }

  ngOnInit(): void {
    this.subscription = this.store.pipe(select(sidebarToggleState)).subscribe(state => {
      this.sidebarState = state;
      if (this.sidebarState) {
        this.width = 56;
      } else {
        this.width = 10;
      }
    });
  }

  public expandSidebar(): void{
    if (!this.sidebarState)
      this.width = 56;
  }
  public shrinkSidebar(): void {
    if (!this.sidebarState)
      this.width = 10;
  }

  setPageSizeOptions(setPageSizeOptionsInput: string): void {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
