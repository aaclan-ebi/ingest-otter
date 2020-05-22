import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {JsonPropertyBaseComponent} from './json-property-base.component';
import {JsonProperty} from '../../models/json-property';
import {JsonSchemaProperty} from '../../models/json-schema-property';

describe('PropertyBaseComponent', () => {
  let component: JsonPropertyBaseComponent;
  let fixture: ComponentFixture<JsonPropertyBaseComponent>;
  let property: JsonProperty;
  let schema: JsonSchemaProperty;

  beforeEach(async(() => {
    schema = {
      $id: '',
      $schema: '',
      description: 'Name of individual who has contributed to the project.',
      type: 'string',
      example: 'John,D,Doe; Jane,,Smith',
      guidelines: 'Enter in the format: first name,middle name or initial,last name.',
      user_friendly: 'Contact name'
    };

    property = new JsonProperty({
      schema: schema as JsonSchemaProperty,
      key: 'contact',
      isRequired: false
    });

    TestBed.configureTestingModule({
      declarations: [JsonPropertyBaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonPropertyBaseComponent);
    component = fixture.componentInstance;
    component.property = property;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise attributes based on its property', () => {

    expect(component.helperText).toEqual('Enter in the format: first name,middle name or initial,last name.');
    expect(component.isRequired).toEqual(false);
    expect(component.disabled).toEqual(false);
    expect(component.placeholder).toEqual('John,D,Doe; Jane,,Smith');
    expect(component.label).toEqual('Contact name');

  });
});
