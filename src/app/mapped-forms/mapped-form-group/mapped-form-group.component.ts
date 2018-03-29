import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MappedFormControl, MappedFormGroup } from '../mapped-forms';
import { KeysPipe } from '../keys.pipe';

@Component({
  selector: 'app-mapped-form-group',
  templateUrl: './mapped-form-group.component.html',
  styleUrls: ['./mapped-form-group.component.scss']
})
export class MappedFormGroupComponent implements OnInit {
  @Input() value: object = {};
  @Input() form: MappedFormGroup;

  schema: object;

  constructor() {
  }

  ngOnInit() {
    this.schema = this.form.schema;
  }

  isObject(key: string): boolean {
    return this.schema['properties'][key]['type'] === "object";
  }

  get title(): string {
    let parts = this.form.path.split('.');
    let key = parts[parts.length - 1];
    let keyParts = key.split('[');
    let i = keyParts.length > 1 && (parseInt(keyParts[1].slice(0, -1)) + 1);
    let index = (i ? " " + i : "");
    if (this.schema['title'])
      return this.schema['title'] + index;
    if (this.form.path) {
      return keyParts[0] + index;
    }
    return "";
  }
}
