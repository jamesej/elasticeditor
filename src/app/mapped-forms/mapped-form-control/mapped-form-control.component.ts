import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MappedFormArray, MappedFormGroup, MappedFormControl } from '../mapped-forms';

@Component({
  selector: 'app-mapped-form-control',
  templateUrl: './mapped-form-control.component.html',
  styleUrls: ['./mapped-form-control.component.css']
})
export class MappedFormControlComponent implements OnInit {
  @Input() form: FormGroup | FormArray;
  @Input() key: string;
  @Input() hideLabel: boolean = false;

  schema: object;

  constructor() { }

  ngOnInit() {
    if (!!this.form['at']) {
      this.schema = (<MappedFormArray>this.form).schema['items'];
    } else {
      this.schema = (<MappedFormGroup>this.form.get(this.key)).schema;
    }
  }

  get control(): MappedFormControl {
    if (!!this.form['at']) {
      return <MappedFormControl>(<MappedFormArray>this.form).at(parseInt(this.key));
    } else {
      return <MappedFormControl>(this.form.get(this.key));
    }
  }

  get controlType(): string {
    let type = this.schema['type'];
    if (this.schema['format'])
      type += " " + this.schema['format'];
    if (this.schema['enum'])
      type = "enum";
    switch (type) {
      case "string date-time":
      case "string date":
      case "string time":
      case "string email":
        return this.schema['format'];
      default:
        return type;
    }
  }

  get title(): string {
    return this.control.title || this.key;
  }

  get classes(): string {
    if (this.showInvalid) {
      return "is-invalid";
    } else {
      return "is-valid";
    }
  }

  get showInvalid(): boolean {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  }
}
