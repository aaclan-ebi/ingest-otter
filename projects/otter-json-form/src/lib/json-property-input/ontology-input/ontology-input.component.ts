import {Component} from '@angular/core';
import {OntologyService} from '../ontology-base/ontology.service';
import {OntologyBaseComponent} from '../ontology-base/ontology-base.component';
import {Ontology} from '../ontology-base/ontology';


@Component({
  selector: 'app-ontology-input',
  templateUrl: './ontology-input.component.html',
  styleUrls: ['./ontology-input.component.css']
})
export class OntologyInputComponent extends OntologyBaseComponent {

  constructor(protected ols: OntologyService) {
    super(ols);
  }


  updateControl(value: Ontology | string) {
    if (typeof value === 'string') {
      value = value.trim();

      if (!value) {
        this.control.reset();
      } else {
        const originalValue = this.control.value.ontology ? this.control.value : '';
        this.searchControl.setValue(originalValue);
      }

    } else {
      this.control.patchValue(value ? value : {});
    }
  }


}
