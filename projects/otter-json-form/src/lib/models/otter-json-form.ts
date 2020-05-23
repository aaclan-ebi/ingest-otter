import {JsonSchema} from './json-schema';
import {OtterJsonFormConfig} from './otter-json-form-config';
import {JsonProperty} from './json-property';
import {AbstractControl, FormGroup} from '@angular/forms';
import {JsonSchemaProperty} from './json-schema-property';
import {OtterJsonFormHelper} from './otter-json-form-helper';

export class OtterJsonForm {
  propertyRegistry: object;
  key: string;
  jsonSchema: JsonSchema;
  data: any;
  config: OtterJsonFormConfig;
  helper: OtterJsonFormHelper;
  formGroup: FormGroup;

  constructor(key: string, jsonSchema: JsonSchema, data?: any, config?: OtterJsonFormConfig) {
    this.key = key;
    this.jsonSchema = jsonSchema;
    this.data = data;
    this.propertyRegistry = {};
    this.config = config;
    this.helper = new OtterJsonFormHelper(config);
    this.initForm(this);
  }

  get(key: string): JsonProperty | undefined {
    return this.propertyRegistry[key];
  }

  getControl(key: string, rootControl?: AbstractControl): AbstractControl {
    const fieldParts = key.split('.');

    let control: AbstractControl;

    if (!rootControl) {
      control = this.formGroup;
    } else {
      control = rootControl;
    }

    fieldParts.shift();

    for (const part of fieldParts) {
      control = control['controls'][part];
    }

    return control;
  }

  initForm(form: OtterJsonForm): OtterJsonForm {
    this.formGroup = this.helper.toFormGroup(form.jsonSchema as JsonSchema, form.data);
    this.buildPropertyRegistry(form.key, form.jsonSchema as JsonSchema);
    return form;
  }

  buildPropertyRegistry(parentKey: string, jsonSchema: JsonSchema): void {
    const registry = this.propertyRegistry;

    let parentProperty;
    if (registry[parentKey] === undefined) {
      parentProperty = new JsonProperty({
        key: parentKey,
        schema: jsonSchema as JsonSchemaProperty
      });
      registry[parentKey] = parentProperty;
    } else {
      parentProperty = registry[parentKey];
    }

    for (const key of Object.keys(jsonSchema.properties)) {
      let property: JsonProperty;
      const propertyKey = parentKey ? parentKey + '.' + key : key;
      if (registry[propertyKey] === undefined) {
        property = this.helper.createJsonProperty(jsonSchema, key);
        registry[propertyKey] = property;
      } else {
        property = registry[propertyKey];
      }

      parentProperty.addChild(propertyKey);
      parentProperty.addChildProperty(property);
      property.setParent(parentKey);
      property.setParentProperty(parentProperty);

      if (parentProperty.isHidden) {
        property.setHidden(true);
      }

      if (property.isScalar()) {
      } else if (property.isScalarList()) {

      } else if (property.isObject()) {
        this.buildPropertyRegistry(propertyKey, property.schema as JsonSchema);

      } else if (property.isObjectList()) {
        this.buildPropertyRegistry(propertyKey, property.schema.items as JsonSchema);

      }
    }
  }
}

