import {Directive, ViewContainerRef} from '@angular/core';


@Directive({
  selector: '[property]'
})
export class JsonPropertyDirective {

  constructor(public container: ViewContainerRef) {
  }

}
