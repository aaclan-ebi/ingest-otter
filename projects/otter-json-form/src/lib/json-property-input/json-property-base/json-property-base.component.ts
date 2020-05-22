import {Component, OnInit} from '@angular/core';
import {JsonProperty} from '../../models/json-property';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-property-base',
  template: '',
  styleUrls: ['./json-property-base.component.css']
})
export class JsonPropertyBaseComponent implements OnInit {
  property: JsonProperty;
  control: AbstractControl;
  id: string;

  label: string;
  helperText: string;
  isRequired: boolean;
  error: string;
  placeholder: string;
  disabled: boolean;

  constructor() {
  }

  ngOnInit(): void {
    const userFriendly = this.property.schema.user_friendly;
    const title = this.property.schema.title;
    this.label = userFriendly ? userFriendly : title ? title : this.property.key;

    const guidelines = this.property.schema.guidelines;
    const description = this.property.schema.description;
    this.helperText = guidelines ? guidelines : description;

    this.isRequired = this.property.isRequired;

    this.disabled = this.property.isDisabled || this.property.isDisabled;

    this.placeholder = this.property.schema.example;
  }

}
