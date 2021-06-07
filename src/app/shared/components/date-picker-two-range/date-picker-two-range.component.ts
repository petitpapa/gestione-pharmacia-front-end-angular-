import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {debounceTime, distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-date-picker-two-range',
  templateUrl: './date-picker-two-range.component.html',
  styleUrls: ['./date-picker-two-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerTwoRangeComponent implements OnInit, OnDestroy{
  campaignOne: FormGroup;
  @Output()
  onStartDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output()
  onEndDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  subscriptions: Subscription[] = [];
  constructor() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const day = today.getDay();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, day)),
      end: new FormControl(new Date(year, month, day))
    });
  }

  ngOnInit(): void {

    this.subscriptions.push(this.campaignOne.get('end').valueChanges.pipe(debounceTime(400), distinctUntilChanged()).subscribe(s =>{
      this.onStartDateChange.emit(this.campaignOne.get('start').value);
      this.onEndDateChange.emit(s);
    }));
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
