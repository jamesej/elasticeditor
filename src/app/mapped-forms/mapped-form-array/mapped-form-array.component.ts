import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MappedFormControl, MappedFormGroup, MappedFormArray } from '../mapped-forms';

@Component({
  selector: 'app-mapped-form-array',
  templateUrl: './mapped-form-array.component.html',
  styleUrls: ['./mapped-form-array.component.css']
})
export class MappedFormArrayComponent implements OnInit {
  @Input() value: object[] = [];
  @Input() form: MappedFormArray;

  schema: object;

  constructor() { }

  ngOnInit() {
    this.schema = this.form.schema;
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

  get isTable(): boolean {
    return (this.schema['format'] && this.schema['format'] == 'table');
  }

  add() {
    this.form.push(this.form.createItem(null, this.form.controls.length));
  }

  up(pos: number) {
    if (pos == 0)
      return;
    let moveControl = this.form.at(pos);
    let movePath = moveControl['path'];
    moveControl['path'] = this.form.at(pos - 1)['path'];
    this.form.removeAt(pos);
    this.form.at(pos - 1)['path'] = movePath;
    this.form.insert(pos - 1, moveControl);
  }

  down(pos: number) {
    if (pos >= this.form.controls.length - 1)
      return;
      let moveControl = this.form.at(pos);
      let movePath = moveControl['path'];
      moveControl['path'] = this.form.at(pos + 1)['path'];
      this.form.removeAt(pos);
      this.form.at(pos)['path'] = movePath;
      this.form.insert(pos + 1, moveControl);
  }
  
  delete(pos: number) {
    this.form.removeAt(pos);
  }
}
