import {OtterJsonFormService} from '../otter-json-form.service';
import {JsonSchema} from './json-schema';
import * as jsonSchema from '../test-json-files/test-json-schema.json';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {JsonProperty} from './json-property';
import {JsonSchemaProperty} from './json-schema-property';
import {OtterJsonFormHelper} from './otter-json-form-helper';

describe('OtterJsonFormHelper', () => {

  let otterJsonFormHelper: OtterJsonFormHelper;
  let otterJsonFormService: OtterJsonFormService;
  let testSchema: JsonSchema;

  beforeEach(() => {
    testSchema = (jsonSchema as any).default;
    otterJsonFormHelper = new OtterJsonFormHelper({});
    otterJsonFormService = new OtterJsonFormService();
  });

  it('should be created', () => {
    expect(otterJsonFormHelper).toBeTruthy();
  });

  describe('getFieldMap', () => {
    it('return list of Property objects from non-nested schema', () => {
      // given testSchema
      // when
      const fieldMap = otterJsonFormHelper.getFieldMap(testSchema);

      // then
      const actual_properties = Array.from(fieldMap.keys());

      const expected_properties = [
        'describedBy',
        'schema_type',
        'schema_version',
        'array_express_accessions',
        'biostudies_accessions',
        'geo_series_accessions',
        'insdc_project_accessions',
        'insdc_study_accessions',
        'supplementary_links',
        'contributors',
        'funders',
        'publications'
      ];

      expected_properties.forEach(prop => expect(actual_properties).toContain(prop));

    });
  });

  describe('toFormGroup', () => {
    it('return a FormGroup object', () => {
      // given testSchema
      // when
      const formGroup = otterJsonFormHelper.toFormGroup(testSchema);

      // then
      expect(formGroup).toBeTruthy();
      expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
      expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
      expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
      expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);
    });


    it('return a FormGroup object with initialised data', () => {
      // given
      const schema = otterJsonFormHelper.getProperty('contributors', testSchema).items as JsonSchema;
      const data = {
        'name': 'Nathan Smith',
        'institution': 'MRCN',
        'corresponding_contributor': false
      };
      // when
      const formGroup = otterJsonFormHelper.toFormGroup(schema as JsonSchema, data);

      // then
      expect(formGroup instanceof FormGroup).toEqual(true);
      expect(Object.keys(formGroup.controls).length).toEqual(12);
      expect(formGroup.controls['name'] instanceof FormControl).toEqual(true);
      expect(otterJsonFormService.cleanFormData(formGroup.value)).toEqual(data);
    });

  });

  describe('toFormControl', () => {
    it('return a toFormControl object', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: false
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(undefined);
      expect(formControl.validator).toEqual(null);
    });

    it('return a toFormControl object with undefined value and validator', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field);
      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(undefined);
      expect(formControl.validator).toEqual(Validators.required);
    });

    it('return a toFormControl object with string data', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, 'string');

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual('string');
    });

    it('return a toFormControl object with blank string', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, '');

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual('');
    });

    it('return a toFormControl object with empty array', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, []);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual([]);
    });

    it('return a toFormControl object with empty object', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, {});

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual({});
    });

    it('return a toFormControl object with number data', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, 100);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(100);
    });

    it('return a toFormControl object with boolean data', () => {
      // given
      const field: JsonProperty = new JsonProperty({
        schema: undefined,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formControl = otterJsonFormHelper.toFormControl(field, false);

      // then
      expect(formControl instanceof FormControl).toEqual(true);
      expect(formControl.value).toEqual(false);
    });
  });

  describe('toFormGroupArray', () => {
    it('return a FormArray of FormGroup', () => {
      // given
      const schema = otterJsonFormHelper.getProperty('contributors', testSchema);

      // when
      const formArray = otterJsonFormHelper.toFormGroupArray(schema.items as JsonSchema, undefined);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormGroup).toEqual(false);
      expect(otterJsonFormService.cleanFormData(formArray.value)).toEqual(null);
    });

    it('return a FormArray of FormGroup with data', () => {
      // given
      const schema = otterJsonFormHelper.getProperty('contributors', testSchema);
      const data = [
        {
          'name': 'Nathan Smith',
          'institution': 'MRCN',
          'corresponding_contributor': false
        },
        {
          'name': 'Jules-Pierre Mao',
          'institution': 'Protogen',
          'corresponding_contributor': false
        },
        {
          'name': 'Lawrence Strickland',
          'institution': 'Protogen',
          'corresponding_contributor': true
        }
      ];
      // when
      const formArray = otterJsonFormHelper.toFormGroupArray(schema.items as JsonSchema, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormGroup).toEqual(true);
      expect(otterJsonFormService.cleanFormData(formArray.value)).toEqual(data);
    });
  });

  describe('toFormControlArray', () => {
    it('return a FormArray of FormControl', () => {
      // given
      const schema = otterJsonFormHelper.getProperty('insdc_study_accessions', testSchema);
      const field: JsonProperty = new JsonProperty({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });

      // when
      const formArray = otterJsonFormHelper.toFormControlArray(field, undefined);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(otterJsonFormService.cleanFormData(formArray.value)).toEqual([]);
    });

    it('return a FormArray of FormControl with initialised data', () => {
      // given
      const schema = otterJsonFormHelper.getProperty('insdc_study_accessions', testSchema);
      const field: JsonProperty = new JsonProperty({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });
      const data = ['string1', 'string2', 'string3'];
      // when
      const formArray = otterJsonFormHelper.toFormControlArray(field, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(otterJsonFormService.cleanFormData(formArray.value)).toEqual(data);
    });

    it('return a FormArray of FormControl with initialised boolean data array', () => {
      // given
      const schema = {
        'description': '',
        'example': '',
        'guidelines': '',
        'items': {
          'type': 'boolean'
        },
        'type': 'array',
        'user_friendly': ''
      } as JsonSchemaProperty;

      const field: JsonProperty = new JsonProperty({
        schema: schema,
        key: 'project',
        isRequired: true,
        isDisabled: true,
        isHidden: true
      });
      const data = [false, false, false];
      // when
      const formArray = otterJsonFormHelper.toFormControlArray(field, data);

      // then
      expect(formArray instanceof FormArray).toEqual(true);
      expect(formArray.controls[0] instanceof FormControl).toEqual(true);
      expect(otterJsonFormService.cleanFormData(formArray.value)).toEqual(data);
    });
  });
});
