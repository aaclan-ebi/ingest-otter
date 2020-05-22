import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {JsonProperty} from '../../models/json-property';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import pluralize from 'pluralize';
import {JsonSchema} from '../../models/json-schema';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';

@Component({
  selector: 'app-input-field',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent extends JsonPropertyBaseComponent {
  formHelper: OtterJsonFormHelper;

  constructor() {
    super();
    this.formHelper = new OtterJsonFormHelper();
  }

  singularize(word: string) {
    return pluralize.singular(word);
  }

  removeFormControl(control: AbstractControl, i: number) {
    if (confirm('Are you sure?')) {
      const formArray = control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(metadata: JsonProperty, formControl: AbstractControl) {
    const formArray = formControl as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(metadata.schema.items as JsonSchema);
    formArray.insert(count, formGroup);
  }
}
