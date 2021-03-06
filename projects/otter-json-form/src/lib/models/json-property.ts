import {JsonSchemaProperty} from './json-schema-property';

export class JsonProperty {
  schema: JsonSchemaProperty;
  key: string;
  isRequired: boolean;
  isDisabled: boolean;
  isHidden: boolean;

  parent: string;
  children?: string[];

  inputType: string;
  parentProperty: JsonProperty;
  childrenProperties: JsonProperty[];

  constructor(options: {
    schema: JsonSchemaProperty,
    key: string,
    isRequired?: boolean,
    isDisabled?: boolean
    isHidden?: boolean,

    parent?: string,
    children?: string[],

    inputType?: string
  }) {
    this.schema = options.schema;
    this.key = options.key;
    this.isRequired = options.isRequired === undefined ? false : options.isRequired;
    this.isDisabled = options.isDisabled === undefined ? false : options.isDisabled;
    this.isHidden = options.isHidden === undefined ? false : options.isHidden;
    this.children = [];
    this.childrenProperties = [];
    this.inputType = options.inputType;
  }

  isObjectList(): boolean {
    const items = this.schema.items ? this.schema.items : {};
    return (['array'].indexOf(this.schema.type) >= 0) && !!items['$schema'];
  }

  isObject(): boolean {
    return (['object'].indexOf(this.schema.type) >= 0) && !!this.schema['$schema'];

  }

  isScalar(): boolean {
    return ['object', 'array'].indexOf(this.schema.type) < 0;
  }

  isScalarList(): boolean {
    const items = this.schema.items ? this.schema.items : {};
    return this.schema.type === 'array' && ['array', 'object'].indexOf(items['type']) < 0;
  }

  addChild(key: string) {
    this.children.push(key);
  }

  addChildProperty(property: JsonProperty) {
    this.childrenProperties.push(property);
  }

  setParent(key: string) {
    this.parent = key;
  }

  setParentProperty(property: JsonProperty) {
    this.parentProperty = property;
  }

  setHidden(hidden: boolean): boolean {
    this.isHidden = hidden
    return hidden;
  }
}

