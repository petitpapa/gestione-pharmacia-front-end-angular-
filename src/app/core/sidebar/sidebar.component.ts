import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {CoreState} from '../store/core.reducer';
import {sidebarStart} from './store/sidebar.actions';
import {loadingSidebarData, sidebarRowData} from './store/sidebar.selectors';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {
  isLoading$ = this.store.pipe(select(loadingSidebarData));
  sidebarRowsData$ = this.store.pipe(select(sidebarRowData));
  constructor(private store: Store<CoreState>) { }

  ngOnInit(): void {
    this.store.dispatch(sidebarStart());
  }

}
