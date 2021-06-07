import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { CoreState } from '../store/core.reducer';
import {sidebarToggleState} from '../../core/store/core.selector';
import { sidebarToggle } from '../store/core.actions';
@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  changed$ = this.store.select(sidebarToggleState);
  onSidebarOpen: boolean;
  constructor(private store: Store<CoreState>) { }

  openSidebar(): void {
    this.onSidebarOpen = true;
    this.store.dispatch(sidebarToggle({sidebarExpanded: this.onSidebarOpen}));
    if (this.onSidebarOpen) {
      this.onSidebarOpen = false;
    }
  }

}
