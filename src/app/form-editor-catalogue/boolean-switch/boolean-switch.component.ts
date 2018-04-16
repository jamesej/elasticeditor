import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { MappedFormControlBase } from '../../mapped-forms/mapped-forms.module';

@Component({
  selector: 'boolean-switch',
  templateUrl: './boolean-switch.component.html',
  styleUrls: ['./boolean-switch.component.css']
})
export class BooleanSwitchComponent extends MappedFormControlBase {
  get isTrue(): boolean {
    return <boolean>this.control.value;
  }

  setValue(val: boolean) {
    this.control.setValue(val);
  }
}