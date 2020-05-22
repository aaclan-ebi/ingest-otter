import {Injectable} from '@angular/core';
import {JsonSchema} from './models/json-schema';
import {OtterJsonFormConfig} from './models/otter-json-form-config';
import {OtterJsonForm} from './models/otter-json-form';
import {OtterJsonFormHelper} from './models/otter-json-form-helper';


@Injectable({providedIn: 'root'})
export class OtterJsonFormService {
  helper: OtterJsonFormHelper;

  constructor() {
  }

  createForm(entity: string, schema: JsonSchema, data: object, config: OtterJsonFormConfig) {
    const form = new OtterJsonForm('project', schema, data, config);
    return form;
  }

  cleanFormData(formData: any): any {
    if (!formData) {
      return formData;
    }
    return this.copyValues(formData);
  }

  copyValues(obj: any): object {
    let copy = null;
    let subCopy = null;

    if (this.isEmpty(obj)) {
      copy = null;
    } else if (Array.isArray(obj)) {
      copy = [];
      for (const elem of obj) {
        subCopy = this.copyValues(elem);
        if (!this.isEmpty(subCopy)) {
          copy.push(subCopy);
        }
      }
    } else if (typeof obj === 'object') {
      copy = {};
      for (const key of Object.keys(obj)) {
        const prop = obj[key];
        subCopy = this.copyValues(prop);
        if (!this.isEmpty(subCopy)) {
          copy[key] = subCopy;
        }
      }
    } else {
      subCopy = obj;
      if (!this.isEmpty(subCopy)) {
        copy = subCopy;
      }
    }
    return copy;
  }

  isEmpty(obj: any): boolean {
    if (obj === undefined || obj === null) {
      return true;
    }

    if (Array.isArray(obj) && obj.length === 0) {
      return true;
    }

    if (typeof obj === 'number' && obj !== null) {
      return false;
    }

    if (typeof obj === 'object' && Object.keys(obj).length === 0) {
      return true;
    }
    return false;
  }


}
