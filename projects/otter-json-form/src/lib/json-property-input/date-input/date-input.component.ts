import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent extends JsonPropertyBaseComponent implements OnInit {
  value: Date;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.value = this.control.value ? new Date(this.control.value) : undefined;
  }

  onDateChanged($event: MatDatepickerInputEvent<any>) {
    const value = $event.value as Date;
    const date = value.toJSON();
    this.control.setValue(date);
  }
}
