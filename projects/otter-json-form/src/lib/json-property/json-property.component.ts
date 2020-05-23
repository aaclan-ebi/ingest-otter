import {Component, ComponentFactoryResolver, Input, OnInit, ViewChild} from '@angular/core';
import {InputComponent} from '../json-property-input/input/input.component';
import {DateInputComponent} from '../json-property-input/date-input/date-input.component';
import {OntologyInputComponent} from '../json-property-input/ontology-input/ontology-input.component';
import {TextListInputComponent} from '../json-property-input/text-list-input/text-list-input.component';
import {JsonProperty} from '../models/json-property';
import {TextAreaComponent} from '../json-property-input/text-area/text-area.component';
import {AbstractControl, FormGroup} from '@angular/forms';
import {JsonPropertyDirective} from '../json-property.directive';
import {JsonSchema} from '../models/json-schema';
import {OntologyListInputComponent} from '../json-property-input/ontology-list-input/ontology-list-input.component';
import {EnumListInputComponent} from '../json-property-input/enum-list-input/enum-list-input.component';

const components = {
  text: InputComponent,
  checkbox: InputComponent,
  number: InputComponent,
  textarea: TextAreaComponent
};


@Component({
  selector: 'json-property',
  templateUrl: './json-property.component.html',
  styleUrls: ['./json-property.component.css']
})
export class JsonPropertyComponent implements OnInit {
  @Input()
  property: JsonProperty;

  @Input()
  control: AbstractControl;

  @ViewChild(JsonPropertyDirective, {static: true}) fieldHost: JsonPropertyDirective;

  constructor(private resolver: ComponentFactoryResolver) {
  }

  ngOnInit(): void {
    this.loadComponent(this.property, this.control, this.property.key);
  }

  private loadComponent(jsonProperty: JsonProperty, control: AbstractControl, id: string) {
    let component;

    if (jsonProperty.isScalar()) {

      component = jsonProperty.inputType ? components[jsonProperty.inputType] : InputComponent;
      component = jsonProperty.schema.format === 'date-time' ? DateInputComponent : component;

    } else if (jsonProperty.isScalarList()) {
      if (jsonProperty.schema.enum) {
        component = EnumListInputComponent;
      } else {
        component = TextListInputComponent;
      }
    } else if (jsonProperty.isObject()) {

      if (jsonProperty.schema && jsonProperty.schema.$id && jsonProperty.schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyInputComponent;
      } else {
        component = InputComponent;
        const formGroup = control as FormGroup;
        for (const child of jsonProperty.childrenProperties) {
          this.loadComponent(child, formGroup['controls'][child.key], `${id}'-'${child.key}`);
        }
      }

    } else { // object list
      const schema = jsonProperty.schema.items as JsonSchema;
      if (schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyListInputComponent;
      } else {
        component = InputComponent;
      }
    }

    if (component) {
      const factory = this.resolver.resolveComponentFactory<any>(component);
      const container = this.fieldHost.container;
      container.clear();
      const newComponent = container.createComponent(factory);
      newComponent.instance.property = jsonProperty;
      newComponent.instance.control = control;
      newComponent.instance.id = id;
    }
  }
}
