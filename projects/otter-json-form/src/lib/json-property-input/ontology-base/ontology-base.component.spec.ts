import {OntologyService} from './ontology.service';
import {JsonProperty} from '../../models/json-property';
import {JsonSchemaProperty} from '../../models/json-schema-property';
import {JsonSchema} from '../../models/json-schema';
import {AbstractControl} from '@angular/forms';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import {OtterJsonFormService} from '../../otter-json-form.service';
import {of} from 'rxjs';
import {OntologyBaseComponent} from './ontology-base.component';
import {OlsHttpResponse} from './ols';
import {Ontology} from './ontology';

describe('OntologyBaseComponent', () => {
  let olsSvc: jasmine.SpyObj<OntologyService>;
  let property: JsonProperty;
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
    property = new JsonProperty({
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

  it('should instantiate', () => {
    const component = new OntologyBaseComponent(olsSvc);
    expect(component).toBeDefined();
  });

  describe('onInit', () => {
    it('should initialise attributes based on property and control', () => {
      // given
      const component = new OntologyBaseComponent(olsSvc);
      component.property = property;
      component.control = control;

      // when
      component.ngOnInit();

      // then
      expect(component.label).toEqual('Contributor role ontology');
      expect(component.helperText).toContain(schema['description']);
      expect(component.isRequired).toEqual(property.isRequired);
      expect(component.searchControl.value).toEqual('');
      expect(component.searchControl.disabled).toEqual(property.isDisabled);
    });
  });

  describe('displayOntology', () => {
    let component: OntologyBaseComponent;

    beforeEach(() => {
      component = new OntologyBaseComponent(olsSvc);
      component.property = property;
      component.control = control;
      component.ngOnInit();
    });

    it('should return blank when input is blank string', () => {
      // given
      const input = '';

      // when
      const output = component.displayOntology(input);

      // then
      expect(output).toEqual('');
    });

    it('should return blank when input is string', () => {
      // given
      const input = 'notblank';

      // when
      const output = component.displayOntology(input);

      // then
      expect(output).toEqual('');
    });

    it('should return correct output format when input is an ontology object', () => {
      // given
      const input: Ontology = {ontology: 'EFO:123', ontology_label: 'label', text: 'text'};

      // when
      const output = component.displayOntology(input);

      // then
      expect(output).toEqual('label (EFO:123)');
    });

    it('should return blank string format when input is undefined', () => {
      // given
      const input = undefined;

      // when
      const output = component.displayOntology(input);

      // then
      expect(output).toEqual('');
    });
  });

  describe('onSearchValueChanged', () => {
    let component: OntologyBaseComponent;

    beforeEach(() => {
      component = new OntologyBaseComponent(olsSvc);
      component.property = property;
      component.control = control;
      component.ngOnInit();
    });

    it('should set searchParams given a search string', () => {
      // given
      olsSvc.select.and.returnValue(of(olsResponse));

      // when
      const output = component.onSearchValueChanged('');

      // then
      expect(olsSvc.lookup).toHaveBeenCalledWith(property.schema, '');
    });

    it('should set ontology label as searchParams given an ontology object', () => {
      // given
      const ontology: Ontology = {ontology: 'EFO:0009736', ontology_label: 'principal investigator', text: 'text'};
      olsSvc.select.and.returnValue(of(olsResponse));

      // when
      const output = component.onSearchValueChanged(ontology);

      // then
      expect(olsSvc.lookup).toHaveBeenCalledWith(property.schema, 'principal investigator');
    });

    it('should return list of ontology objects based on ols service select response', () => {
      // given
      const ontology: Ontology = {
        ontology: 'EFO:0009736',
        ontology_label: 'principal investigator',
        text: 'principal investigator'
      };

      // when
      component.onSearchValueChanged('');

      // then
      expect(olsSvc.lookup).toHaveBeenCalledWith(property.schema, '');

    });
  });

  describe('createSearchControl', () => {
    let component: OntologyBaseComponent;

    beforeEach(() => {
      component = new OntologyBaseComponent(olsSvc);
      component.property = property;
      component.control = control;
      component.ngOnInit();
    });

    it('should return form control with given ontology value', () => {
      // given
      const ontology: Ontology = {
        ontology: 'EFO:0009736',
        ontology_label: 'principal investigator',
        text: 'principal investigator'
      };
      // when
      const output = component.createSearchControl(ontology);

      // then
      expect(output.value).toEqual(ontology);
    });

    it('should return form control with blank string given undefined', () => {
      // given

      // when
      const output = component.createSearchControl(undefined);

      // then
      expect(output.value).toEqual('');
    });

    it('should return form control with blank string given empty object', () => {
      // given

      // when
      const output = component.createSearchControl({ontology: '', ontology_label: '', text: ''});

      // then
      expect(output.value).toEqual('');
    });
  });
});
