import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {JsonSchema} from '../../models/json-schema';
import {concatMap, map} from 'rxjs/operators';
import {Ontology} from './ontology';
import {OlsHttpResponse} from './ols';
import {Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OntologyService {
  API_URL = 'https://ontology.staging.archive.data.humancellatlas.org/';

  OLS_RELATION: object = {
    'rdfs:subClassOf': 'allChildrenOf'
  };

  constructor(private http: HttpClient) {
    console.log('ols url', this.API_URL);
  }

  lookup(schema: JsonSchema, searchText: string): Observable<Ontology[]> {
    return this.createSearchParams(schema, searchText)
      .pipe(
        concatMap(params =>
          this.searchOntologies(params)
        )
      );
  }

  createSearchParams(schema: JsonSchema, searchText?: string): Observable<object> {
    const searchParams = {
      groupField: 'iri',
      start: 0,
      ontology: 'efo',
      q: searchText ? searchText : '*',
      rows: 30 // TODO max result we have for project role and technology is 27,
      // increasing the rows for now to let the users see all the options
    };

    if (!schema) {
      return of(searchParams);
    }

    const properties = schema.properties;
    const graphRestriction = properties['ontology']['graph_restriction'];
    const ontologyClass: string = graphRestriction['classes'][0]; // TODO support only 1 class for now
    const ontologyRelation: string = graphRestriction['relations'][0]; // TODO support only 1 relation for now


    const olsClass = ontologyClass.replace(':', '_');

    const searchParams$ = this.select({q: olsClass})
      .pipe(
        map(data => data as OlsHttpResponse),
        map(data => {
          if (data.response.numFound === 1) {
            const iri = data.response.docs[0].iri;
            searchParams[this.OLS_RELATION[ontologyRelation]] = iri;
            return searchParams;
          }
        })
      );

    return searchParams$;
  }

  searchOntologies(params): Observable<Ontology[]> {
    return this.select(params).pipe(
      map(result => {
        return result.response.docs.map(doc => {
          const ontology: Ontology = {
            ontology: doc.obo_id,
            ontology_label: doc.label,
            text: doc.label
          };
          return ontology;
        });
      })
    );
  }

  select(params): Observable<OlsHttpResponse> {
    return this.http.get(`${this.API_URL}/api/select`, {params})
      .pipe(
        map(response => response as OlsHttpResponse)
      );
  }


}
