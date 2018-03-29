import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MappedFormControl, MappedFormGroup, MappedFormArray } from '../mapped-forms';
import { KeysPipe } from '../keys.pipe';

@Component({
  selector: 'app-mapped-form-table',
  templateUrl: './mapped-form-table.component.html',
  styleUrls: ['./mapped-form-table.component.css']
})
export class MappedFormTableComponent implements OnInit {
  @Input() value: object[] = [];
  @Input() form: MappedFormArray;

  schema: object;
  rowSchema: object;

  constructor() { }

  ngOnInit() {
    this.schema = this.form.schema;
    let items = this.schema['items'];
    if (!items) {
      throw "json schema: array must have an items property";
    }
    if (items['type'] != 'object') {
      throw "json schema: array with table display must have an items property of type=object";
    }
    this.rowSchema = items;
  }

  get title(): string {
    if (this.schema['title'])
      return this.schema['title'];
    if (this.form.path) {
      let parts = this.form.path.split('.');
      return parts[parts.length - 1].split('[')[0];
    }
    return "";
  }

  get columnTitles(): string[] {
    let titles: string[] = [];
    for (let key in this.rowSchema['properties']) {
      let title = this.rowSchema['properties'][key]['title'];
      titles.push(title || key);
    }
    return titles;
  }

  add() {
    this.form.push(this.form.createItem(null, this.form.controls.length));
  }
  
  delete(pos: number) {
    this.form.removeAt(pos);
  }
}
