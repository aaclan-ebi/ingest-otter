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

  private loadComponent(metadata: JsonProperty, control: AbstractControl, id: string) {
    let component;

    if (metadata.isScalar()) {

      component = metadata.inputType ? components[metadata.inputType] : InputComponent;
      component = metadata.schema.format === 'date-time' ? DateInputComponent : component;

    } else if (metadata.isScalarList()) {
      if (metadata.schema.enum) {
        component = EnumListInputComponent;
      } else {
        component = TextListInputComponent;
      }
    } else if (metadata.isObject()) {

      if (metadata.schema && metadata.schema.$id && metadata.schema.$id.indexOf('/module/ontology/') >= 0) {
        component = OntologyInputComponent;
      } else {
        component = InputComponent;
        const formGroup = control as FormGroup;
        for (const child of metadata.childrenProperties) {
          this.loadComponent(child, formGroup['controls'][child.key], `${id}'-'${child.key}`);
        }
      }

    } else { // object list
      const schema = metadata.schema.items as JsonSchema;
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
      newComponent.instance.property = metadata;
      newComponent.instance.control = control;
      newComponent.instance.id = id;
    }
  }
}
