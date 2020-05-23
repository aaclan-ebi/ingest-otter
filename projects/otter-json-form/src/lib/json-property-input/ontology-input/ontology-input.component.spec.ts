import {OntologyInputComponent} from './ontology-input.component';
import {OntologyService} from '../ontology-base/ontology.service';
import {JsonProperty} from '../../models/json-property';
import {JsonSchemaProperty} from '../../models/json-schema-property';
import {JsonSchema} from '../../models/json-schema';
import {AbstractControl} from '@angular/forms';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import {OtterJsonFormService} from '../../otter-json-form.service';
import {OlsHttpResponse} from '../ontology-base/ols';
import {Ontology} from '../ontology-base/ontology';

describe('OntologyInputComponent', () => {
  let olsSvc: jasmine.SpyObj<OntologyService>;
  let jsonProperty: JsonProperty;
  let control: AbstractControl;
  let helper: OtterJsonFormHelper;
  let schema: JsonSchema;
  let otterJsonFormService: OtterJsonFormService;
  let olsResponse: OlsHttpResponse;

  beforeEach(() => {
    olsSvc = jasmine.createSpyObj(['select', 'lookup']);
    schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      $id: 'https://schema.dev.data.humancellatlas.org/module/ontology/1.0.0/contributor_role_ontology',
      description: 'A term that describes the role of a contributor in the project.',
      additionalProperties: false,
      required: [
        'text'
      ],
      title: 'Contributor role ontology',
      name: 'contributor_role_ontology',
      type: 'object',
      properties: {
        text: {
          description: 'The primary role of the contributor in the project.',
          type: 'string',
          example: 'principal investigator; experimental scientist',
          user_friendly: 'Contributor role'
        },
        ontology: {
          description: 'An ontology term identifier in the form prefix:accession.',
          type: 'string',
          graph_restriction: {
            ontologies: [
              'obo:efo'
            ],
            classes: [
              'EFO:0002012'
            ],
            relations: [
              'rdfs:subClassOf'
            ],
            direct: false,
            include_self: false
          },
          example: 'EFO:0009736; EFO:0009741',
          user_friendly: 'Contributor role ontology ID'
        },
        ontology_label: {
          description: 'The preferred label for the ontology term referred to in the ontology field. This may differ from the user-supplied value in the text field.',
          type: 'string',
          example: 'principal investigator; experimental scientist',
          user_friendly: 'Contributor role ontology label'
        }
      }
    };
    jsonProperty = new JsonProperty({
      schema: schema as JsonSchemaProperty,
      key: 'project_role',
      isRequired: false
    });
    helper = new OtterJsonFormHelper();
    otterJsonFormService = new OtterJsonFormService();
    control = helper.toFormGroup(schema);
    const response = {
      numFound: 1,
      start: 0,
      docs: [
        {
          id: 'efo:class:http://www.ebi.ac.uk/efo/EFO_0009736',
          iri: 'http://www.ebi.ac.uk/efo/EFO_0009736',
          short_form: 'EFO_0009736',
          obo_id: 'EFO:0009736',
          label: 'principal investigator',
          ontology_name: 'efo',
          ontology_prefix: 'EFO',
          type: 'class'
        }
      ]
    };
    olsResponse = {highlighting: [], response, responseHeader: undefined};

  });

  describe('updateControl', () => {
    let component: OntologyInputComponent;

    beforeEach(() => {
      component = new OntologyInputComponent(olsSvc);
      component.property = jsonProperty;
      component.control = control;
      component.ngOnInit();
    });

    it('should reset control when input is blank string', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};
      component.control.patchValue(ontology);

      // when
      component.updateControl('');

      // then
      expect(otterJsonFormService.cleanFormData(control.value)).toEqual({});
    });

    it('should reset control when input is all whitespace', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};
      component.control.patchValue(ontology);

      // when
      component.updateControl('     ');

      // then
      expect(otterJsonFormService.cleanFormData(control.value)).toEqual({});
    });

    it('should reset search control to its original value when input is a string', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};
      component.control.patchValue(ontology);

      // when
      component.updateControl('keyword');

      // then
      expect(otterJsonFormService.cleanFormData(component.searchControl.value)).toEqual(ontology);
      expect(otterJsonFormService.cleanFormData(component.control.value)).toEqual(ontology);
    });

    it('should copy search control value to control value when input is an ontology object', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};
      component.control.patchValue(ontology);

      const ontology2: Ontology = {ontology: 'EFO:124', ontology_label: 'label2', text: 'text2'};
      component.searchControl.patchValue(ontology2);

      // when
      component.updateControl(ontology2);

      // then
      expect(otterJsonFormService.cleanFormData(component.control.value)).toEqual(ontology2);
    });

    it('should reset search control to the control value when input is undefined', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};
      component.control.patchValue(ontology);

      const ontology2: Ontology = {ontology: 'EFO:124', ontology_label: 'label2', text: 'text2'};
      component.searchControl.patchValue(ontology2);

      // when
      component.updateControl(undefined);

      // then
      expect(otterJsonFormService.cleanFormData(component.searchControl.value)).toEqual(ontology2);
    });
  });
});
