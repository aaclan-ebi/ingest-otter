import {Component, OnInit} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {OntologyService} from '../ontology-base/ontology.service';
import {JsonSchema} from '../../models/json-schema';
import {OtterJsonFormHelper} from '../../models/otter-json-form-helper';
import {OntologyBaseComponent} from '../ontology-base/ontology-base.component';
import {Observable} from 'rxjs';
import {Ontology} from '../ontology-base/ontology';

@Component({
  selector: 'app-ontology-list-input',
  templateUrl: './ontology-list-input.component.html',
  styleUrls: ['./ontology-list-input.component.css']
})
export class OntologyListInputComponent extends OntologyBaseComponent implements OnInit {
  formHelper: OtterJsonFormHelper;

  constructor(protected ols: OntologyService) {
    super(ols);
    this.formHelper = new OtterJsonFormHelper();
  }

  removeFormControl(i: number) {
    if (confirm('Are you sure?')) {
      const formArray = this.control as FormArray;
      formArray.removeAt(i);
    }
  }

  addFormControl(ontology: Ontology) {
    const formArray = this.control as FormArray;
    const count = formArray.length;

    const formGroup: FormGroup = this.formHelper.toFormGroup(this.property.schema.items as JsonSchema, ontology);
    formArray.insert(count, formGroup);
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() :
      value.ontology_label ? value.ontology_label.toLowerCase() : '';

    return this.ols.lookup(this.property.schema.items as JsonSchema, searchText);
  }

}
