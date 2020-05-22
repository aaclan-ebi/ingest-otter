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

    let parentMetadata;
    if (registry[parentKey] === undefined) {
      parentMetadata = new JsonProperty({
        key: parentKey,
        schema: jsonSchema as JsonSchemaProperty
      });
      registry[parentKey] = parentMetadata;
    } else {
      parentMetadata = registry[parentKey];
    }

    for (const key of Object.keys(jsonSchema.properties)) {
      let metadata: JsonProperty;
      const metadataKey = parentKey ? parentKey + '.' + key : key;
      if (registry[metadataKey] === undefined) {
        metadata = this.helper.createMetadata(jsonSchema, key);
        registry[metadataKey] = metadata;
      } else {
        metadata = registry[metadataKey];
      }

      parentMetadata.addChild(metadataKey);
      parentMetadata.addChildMetadata(metadata);
      metadata.setParent(parentKey);
      metadata.setParentMetadata(parentMetadata);

      if (parentMetadata.isHidden) {
        metadata.setHidden(true);
      }

      if (metadata.isScalar()) {
      } else if (metadata.isScalarList()) {

      } else if (metadata.isObject()) {
        this.buildPropertyRegistry(metadataKey, metadata.schema as JsonSchema);

      } else if (metadata.isObjectList()) {
        this.buildPropertyRegistry(metadataKey, metadata.schema.items as JsonSchema);

      }
    }
  }
}

