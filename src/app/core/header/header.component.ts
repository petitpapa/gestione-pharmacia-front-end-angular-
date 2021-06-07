import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { sidebarToggle } from '../store/core.actions';
import { CoreState } from '../store/core.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {
  onMenuClicked: boolean;
  constructor(private store: Store<CoreState>) { }

  onCloseSidebar(): void {
    this.onMenuClicked = !this.onMenuClicked;
    this.store.dispatch(sidebarToggle({ sidebarExpanded: this.onMenuClicked }));
  }

}
