import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MatSelectionList} from '@angular/material/list';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import {map, startWith} from 'rxjs/operators';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';

@Component({
  selector: 'app-enum-list-input',
  templateUrl: './enum-list-input.component.html',
  styleUrls: ['./enum-list-input.component.css']
})
export class EnumListInputComponent extends JsonPropertyBaseComponent implements OnInit {
  options$: Observable<string[]>;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;
  @ViewChild('input', {read: MatAutocompleteTrigger}) autoComplete;
  @ViewChild('selectionList') selectionList: MatSelectionList;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  example: string;
  disabled: boolean;

  searchControl: AbstractControl;

  formHelper: OtterJsonFormHelper;
  enumValues: string[];

  constructor() {
    super();
    this.formHelper = new OtterJsonFormHelper();
  }


  ngOnInit() {
    super.ngOnInit();

    this.searchControl = this.createSearchControl(this.control.value);

    this.enumValues = this.property.schema.enum;

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(null),
        map((value: string | null) => value ? this._filter(value) : this.enumValues.slice())
      );
  }

  removeFormControl(i: number) {
    if (confirm('Are you sure?')) {
      const formArray = this.control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(value: string) {
    const formArray = this.control as FormArray;
    const count = formArray.length;

    const formControl: FormControl = this.formHelper.toFormControl(this.property, value);
    formArray.insert(count, formControl);
  }

  createSearchControl(value: any) {
    return new FormControl({
      value: value ? value : '',
      disabled: this.property.isDisabled
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value ? value.toLowerCase() : '';
    return this.enumValues.filter(option => option.toLowerCase().includes(filterValue));
  }

}
