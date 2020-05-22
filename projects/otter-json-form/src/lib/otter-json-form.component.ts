import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {OtterJsonFormService} from './otter-json-form.service';
import {JsonSchema} from './models/json-schema';
import {OtterJsonFormConfig} from './models/otter-json-form-config';
import {OtterJsonForm} from './models/otter-json-form';

@Component({
  selector: 'otter-json-form',
  templateUrl: './otter-json-form.component.html',
  styleUrls: ['./otter-json-form.component.css']
})
export class OtterJsonFormComponent implements OnInit {
  @Input() name: string;

  @Input() schema: JsonSchema;

  @Input() layout: object;

  @Input() config: OtterJsonFormConfig;

  @Input() data: object;

  @Input() selectedTabIndex = 0;

  @Output() save = new EventEmitter<object>();

  @Output() cancel = new EventEmitter<boolean>();

  @Output() tabChange = new EventEmitter<number>();

  formGroup: FormGroup;

  form: OtterJsonForm;

  value: object;

  done: boolean;

  constructor(private otterJsonFormService: OtterJsonFormService) {
  }

  ngOnInit(): void {
    this.form = this.otterJsonFormService.createForm('project', this.schema, this.data, this.config);
    console.log('form', this.form);
    this.formGroup = this.form.formGroup;
    this.done = true;

  }

  onSubmit(e) {
    e.preventDefault();
    const formData = this.otterJsonFormService.cleanFormData(this.form.formGroup.value);
    console.log('clean form data', formData);
    this.save.emit(formData);
  }

  confirmCancel(e) {
    if (confirm('Are you sure you want to cancel?')) {
      this.cancel.emit(e);
    }
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  onSelectedIndexChange(tabIndex: number) {
    this.tabChange.emit(tabIndex);
  }
}
