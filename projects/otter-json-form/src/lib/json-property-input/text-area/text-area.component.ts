import {Component, OnInit} from '@angular/core';
import {JsonPropertyBaseComponent} from '../json-property-base/json-property-base.component';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent extends JsonPropertyBaseComponent implements OnInit {
  rows: number;

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.rows = 3;
  }

}
