import {OtterJsonFormConfig} from './otter-json-form-config';
import {JsonSchema} from './json-schema';
import {JsonProperty} from './json-property';
import {JsonSchemaProperty} from './json-schema-property';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

const INPUT_TYPE = {
  string: 'text',
  boolean: 'checkbox',
  integer: 'number'
};

export class OtterJsonFormHelper {
  config: OtterJsonFormConfig;

  constructor(config?: OtterJsonFormConfig) {
    this.config = config;
  }

  getFieldMap(jsonSchema: JsonSchema): Map<string, JsonProperty> {
    const jsonPropertyMap = new Map<string, JsonProperty>();
    for (const key of Object.keys(jsonSchema?.properties)) {
      const jsonProperty = this.createJsonProperty(jsonSchema, key);
      jsonPropertyMap.set(key, jsonProperty);
    }
    return jsonPropertyMap;
  }

  createJsonProperty(jsonSchema: JsonSchema, key: string): JsonProperty {
    const property = this.getProperty(key, jsonSchema);
    const requiredFields = jsonSchema.required ? jsonSchema.required : [];
    const hiddenFields = this.config && this.config.hideFields ? this.config.hideFields : [];
    const disabledFields = this.config && this.config.disableFields ? this.config.hideFields : [];
    const isRequired = requiredFields.indexOf(key) >= 0;
    const isHidden = hiddenFields.indexOf(key) >= 0;
    const isDisabled = this.config && this.config.viewMode || disabledFields.indexOf(key) >= 0;
    const inputType = this.config && this.config.inputType && this.config.inputType[key] ?
      this.config.inputType[key] : INPUT_TYPE[property.type]

    const jsonProperty = new JsonProperty({
      isRequired,
      isHidden,
      isDisabled,
      key,
      schema: property,
      inputType
    });
    return jsonProperty;
  }

  getProperty(key: string, jsonSchema: JsonSchema): JsonSchemaProperty {
    return jsonSchema.properties[key];
  }

  toFormGroup(jsonSchema: JsonSchema, data?: object): FormGroup {
    const group: any = {};
    this.getFieldMap(jsonSchema).forEach((field: JsonProperty, key: string) => {
      const subData = data !== undefined ? data ? data[key] : null : undefined;
      if (field.isScalar()) {
        const formControl = this.toFormControl(field, subData);
        group[field.key] = formControl;
      } else if (field.isScalarList()) {
        const formArray = this.toFormControlArray(field, subData);
        group[field.key] = formArray;
      } else if (field.isObject()) {
        group[field.key] = this.toFormGroup(field.schema as JsonSchema, subData);
      } else if (field.isObjectList()) {
        group[field.key] = this.toFormGroupArray(field.schema.items as JsonSchema, subData);
      }
    });

    return new FormGroup(group);
  }

  toFormControl(field: JsonProperty, data?: any) {
    const state = {value: data, disabled: field.isDisabled};
    const formControl = field.isRequired ? new FormControl(state, Validators.required)
      : new FormControl(state);
    return formControl;
  }

  toFormGroupArray(jsonSchema: JsonSchema, data?: any[]): FormArray {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormGroup(jsonSchema as JsonSchema, elem);
        controlData.push(elemFormControl);
      }
    }
    return new FormArray(controlData);
  }

  toFormControlArray(field: JsonProperty, data?: any) {
    const controlData = [];
    if (data && data.length > 0) {
      for (const elem of data) {
        const elemFormControl = this.toFormControl(field, elem);
        controlData.push(elemFormControl);
      }
    } else {
      controlData.push(this.toFormControl(field, undefined));
    }
    return new FormArray(controlData);
  }

}
