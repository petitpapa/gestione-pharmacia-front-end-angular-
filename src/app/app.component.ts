import { Component, OnDestroy, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { Store } from '@ngrx/store';
import { CoreState } from './core/store/core.reducer';
import { MessageType } from './core/models/message.type';
import { selectNotificationPopup } from './core/store/core.selector';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  openToastr$ = this._store.select(selectNotificationPopup);
  subscription$: Subscription;
  constructor(
    //private electronService: ElectronService,
    private translate: TranslateService, private _store: Store<CoreState>, private toastr: ToastrService
  ) {
    this.translate.setDefaultLang('en');

  }
  ngOnInit() {
    this.subscription$ = this.openToastr$.subscribe(notification =>
      this.handleNotificationMessage(notification)
    )
  }

  private handleNotificationMessage(notification: { msgType: MessageType; notificationMessage: string; }) {
    switch (notification.msgType) {
      case MessageType.SUCCESS:
        this.toastr.success(notification.notificationMessage); break;
      case MessageType.ERROR:
        this.toastr.error(notification.notificationMessage); break;
      case MessageType.WARNING:
        this.toastr.warning(notification.notificationMessage); break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this.subscription$.unsubscribe();
  }
}
