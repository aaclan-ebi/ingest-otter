import * as jsonSchema from '../test-json-files/test-json-schema.json';
import * as json from '../test-json-files/test-json.json';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {JsonSchema} from './json-schema';
import {JsonSchemaProperty} from './json-schema-property';
import {OtterJsonForm} from './otter-json-form';
import {OtterJsonFormService} from '../otter-json-form.service';
import {OtterJsonFormConfig} from './otter-json-form-config';

describe('OtterJsonForm', () => {
  let testSchema: JsonSchema;
  let otterJsonFormService: OtterJsonFormService;

  beforeEach(() => {
    testSchema = (jsonSchema as any).default;
    otterJsonFormService = new OtterJsonFormService();
  });

  it('return FormGroup obj', () => {
    // given testSchema

    // when
    const otterJsonForm = new OtterJsonForm('project', testSchema);
    const formGroup = otterJsonForm.formGroup;

    // then
    expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
    expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
    expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
    expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);
    expect(otterJsonFormService.cleanFormData(formGroup.value))
      .toEqual({});

  });

  it('return FormGroup obj with data', () => {
    // given
    const testData = (json as any).default;

    // when
    const otterJsonForm = new OtterJsonForm('project', testSchema, testData);
    const formGroup = otterJsonForm.formGroup;

    // then
    expect(formGroup.get('array_express_accessions') instanceof FormArray).toEqual(true);
    expect(formGroup.get('schema_type') instanceof FormControl).toEqual(true);
    expect(formGroup.get('contributors') instanceof FormArray).toEqual(true);
    expect(formGroup.get('project_core') instanceof FormGroup).toEqual(true);

    expect(otterJsonFormService.cleanFormData(formGroup.value))
      .toEqual(otterJsonFormService.cleanFormData(testData));

  });

  it('return propertyRegistry', () => {
    // given
    const testData = (json as any).default;

    // when
    const otterJsonForm = new OtterJsonForm('project', testSchema, testData);
    const propertyRegistry = otterJsonForm.propertyRegistry;

    // then
    expect(propertyRegistry).toBeTruthy();
    expect(otterJsonForm.get('project').schema).toEqual(testSchema as JsonSchemaProperty);
  });

  it('return propertyRegistry with config', () => {
    // given
    const testData = (json as any).default;
    const config: OtterJsonFormConfig = {
      hideFields: [
        'describedBy',
        'schema_version',
        'schema_type',
        'provenance'
      ],
      removeEmptyFields: true
    };

    // when
    const otterJsonForm = new OtterJsonForm('project', testSchema, testData, config);
    const propertyRegistry = otterJsonForm.propertyRegistry;

    // then
    expect(propertyRegistry).toBeTruthy();
    expect(otterJsonForm.get('project.describedBy').isHidden).toEqual(true);
    expect(otterJsonForm.get('project.schema_version').isHidden).toEqual(true);
    expect(otterJsonForm.get('project.schema_type').isHidden).toEqual(true);
    expect(otterJsonForm.get('project.provenance').isHidden).toEqual(true);
  });

  describe('getControl', () => {
    let otterJsonForm: OtterJsonForm;
    let testData: object;

    beforeEach(() => {
      testData = (json as any).default;
      otterJsonForm = new OtterJsonForm('project', testSchema, testData);
    });

    it('return form group given a level 0 key', () => {
      // given otterJsonForm

      // when
      const projectControl = otterJsonForm.getControl('project');

      // then
      const formGroup = otterJsonForm.formGroup;

      expect(projectControl).toEqual(formGroup);
      expect(projectControl instanceof FormGroup).toEqual(true);
    });

    it('return form control given a level 1 key - scalar value', () => {
      // given otterJsonForm

      // when
      const control = otterJsonForm.getControl('project.describedBy');

      // then
      const formGroup = otterJsonForm.formGroup;

      expect(control).toEqual(formGroup['controls']['describedBy']);
      expect(control instanceof FormControl).toEqual(true);
      expect(control.value).toEqual('https://schema.dev.data.humancellatlas.org/type/project/15.0.0/project');
    });

    it('return form group given a level 1 key - scalar value', () => {
      // given otterJsonForm

      // when
      const control = otterJsonForm.getControl('project.project_core');

      // then
      const formGroup = otterJsonForm.formGroup;
      const formData = otterJsonFormService.cleanFormData(control.value);

      expect(control).toEqual(formGroup['controls']['project_core']);
      expect(control instanceof FormGroup).toEqual(true);
      expect(formData).toEqual(testData['project_core']);
    });

    it('return form control given level 2 - scalar value', () => {
      // given otterJsonForm

      // when
      const control = otterJsonForm.getControl('project.project_core.project_title');

      // then
      const formGroup = otterJsonForm.formGroup;
      const projectCore = formGroup['controls']['project_core'];

      expect(control).toEqual(projectCore['controls']['project_title']);
      expect(control instanceof FormControl).toEqual(true);
      expect(control.value).toEqual('Sequencing of Phoebe core samples');
    });

    it('return form array given a level 1 key - array', () => {
      // given otterJsonForm

      // when
      const control = otterJsonForm.getControl('project.publications');

      // then
      const formGroup = otterJsonForm.formGroup;
      const publications = formGroup['controls']['publications'];

      expect(control).toEqual(publications);
      expect(control instanceof FormArray).toEqual(true);
      expect(otterJsonFormService.cleanFormData(control.value)).toEqual([{
        authors: [
          'Corey JSA',
          'Franck T',
          'Abraham D'
        ],
        title: 'Leviathan Wakes',
        url: 'https://expanse.fandom.com/wiki/Leviathan_Wakes'
      },
        {
          authors: [
            'Fergus M',
            'Ostby H',
            'McDonough T'
          ],
          title: 'The Expanse',
          url: 'https://expanse.fandom.com/wiki/Season_1'
        }
      ]);
    });


    it('return form array given a level 2 key - array, with root control', () => {
      // given otterJsonForm
      const formGroup = otterJsonForm.formGroup;
      const publications = formGroup['controls']['publications'];

      // when
      const control = otterJsonForm.getControl('.authors', publications['controls'][0]);
      console.log('publications', publications);
      console.log('.authors', control);

      // then
      expect(control).toEqual( publications['controls'][0]['controls']['authors']);
      expect(control instanceof FormArray).toEqual(true);
      expect(otterJsonFormService.cleanFormData(control.value)).toEqual([
        'Corey JSA',
        'Franck T',
        'Abraham D'
      ]);
    });

  });
});
