import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {OntologyService} from './ontology.service';
import {Observable} from 'rxjs';
import {concatMap, startWith} from 'rxjs/operators';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';
import {Ontology} from './ontology';

@Component({
  selector: 'app-ontology-base',
  template: ``,
  styleUrls: ['./ontology-base.component.css']
})
export class OntologyBaseComponent extends JsonPropertyBaseComponent implements OnInit {
  searchControl: FormControl;
  options$: Observable<Ontology[]>;
  olsUrl: '';

  constructor(protected ols: OntologyService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    const ontologyReference = `Please note that if the search result is too large, not all options may be displayed. Please see <a href="${this.olsUrl}" target="_blank">Ontology Lookup Service</a> for reference.`;
    this.helperText = this.helperText + ' ' + ontologyReference;
    this.searchControl = this.createSearchControl(this.control.value);

    this.options$ = this.searchControl.valueChanges
      .pipe(
        startWith(this.searchControl.value ? this.searchControl.value : ''),
        concatMap(value => this.onSearchValueChanged(value))
      );
  }

  createSearchControl(value: Ontology) {
    return new FormControl({
      value: value && value.ontology ? value : '',
      disabled: this.property.isDisabled
    });
  }

  displayOntology(ontology: Ontology | string) {
    if (typeof ontology === 'string') {
      return '';
    }
    return ontology && ontology.ontology_label ? `${ontology.ontology_label} (${ontology.ontology})` : '';
  }

  onSearchValueChanged(value: string | Ontology): Observable<Ontology[]> {
    const searchText = typeof value === 'string' ? value.toLowerCase() :
      value.ontology_label ? value.ontology_label.toLowerCase() : '';

    return this.ols.lookup(this.property.schema, searchText);
  }

}
