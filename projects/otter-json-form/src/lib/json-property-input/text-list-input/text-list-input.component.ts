import {Component, OnInit} from '@angular/core';
import {FormArray} from '@angular/forms';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';

@Component({
  selector: 'app-text-list-input',
  templateUrl: './text-list-input.component.html',
  styleUrls: ['./text-list-input.component.css']
})
export class TextListInputComponent extends JsonPropertyBaseComponent implements OnInit {
  formHelper: OtterJsonFormHelper;
  value: string;
  rows: number;

  constructor() {
    super();
    this.formHelper = new OtterJsonFormHelper();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.rows = 3;
    this.value = this.control.value.join('\n');
  }

  change($event) {
    const input = $event.target as HTMLInputElement;
    const formArray = this.control as FormArray;
    const value = input.value;

    if (value.trim()) {
      formArray.clear();
      const data = value.split('\n');
      if (data && data.length > 0) {
        for (const elem of data) {
          const val = elem.trim();
          if (val) {
            const elemFormControl = this.formHelper.toFormControl(this.property, elem.trim());
            formArray.push(elemFormControl);
          }
        }
      }
    } else {
      formArray.clear();
    }
  }
}
