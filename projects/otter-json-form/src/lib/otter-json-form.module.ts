import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {OtterJsonFormComponent} from './otter-json-form.component';
import {InputComponent} from './json-property-input/input/input.component';
import {VfInputComponent} from './json-property-input/custom-input/vf-input/vf-input.component';
import {JsonPropertyDirective} from './json-property.directive';
import {TextListInputComponent} from './json-property-input/text-list-input/text-list-input.component';
import {TextAreaComponent} from './json-property-input/text-area/text-area.component';
import {VfAsteriskComponent} from './json-property-input/custom-input/vf-asterisk/vf-asterisk.component';
import {DateInputComponent} from './json-property-input/date-input/date-input.component';
import {OntologyInputComponent} from './json-property-input/ontology-input/ontology-input.component';
import {MultipleSelectComponent} from './json-property-input/custom-input/multiple-select/multiple-select.component';
import {JsonPropertyComponent} from './json-property/json-property.component';
import {SelectComponent} from './json-property-input/custom-input/select/select.component';
import {OntologyListInputComponent} from './json-property-input/ontology-list-input/ontology-list-input.component';
import {EnumListInputComponent} from './json-property-input/enum-list-input/enum-list-input.component';
import {OntologyBaseComponent} from './json-property-input/ontology-base/ontology-base.component';
import {JsonPropertyBaseComponent} from './json-property-input/json-property-base/json-property-base.component';
import {MaterialModule} from './material.module';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MaterialModule
  ],
  declarations: [
    OtterJsonFormComponent,
    InputComponent,
    VfInputComponent,
    JsonPropertyDirective,
    TextListInputComponent,
    TextAreaComponent,
    VfAsteriskComponent,
    DateInputComponent,
    OntologyInputComponent,
    MultipleSelectComponent,
    JsonPropertyComponent,
    SelectComponent,
    OntologyListInputComponent,
    EnumListInputComponent,
    OntologyBaseComponent,
    JsonPropertyBaseComponent
  ],
  exports: [
    OtterJsonFormComponent
  ],
  providers: []
})
export class OtterJsonFormModule {
}
