import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MappedFormGroup, MappedFormArray } from '../mapped-forms';
import { SchemaForm } from '../schema-form';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-mapped-form',
  templateUrl: './mapped-form.component.html',
  styleUrls: ['./mapped-form.component.css']
})
export class MappedFormComponent implements OnInit {
  @Input() value: object = {};
  @Input() schema: object = {};
  @Output() onSubmit = new EventEmitter<object>();

  form: MappedFormGroup;

  constructor(private ref: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.form = new SchemaForm(this.schema).asRoot(this.value);
  }

  submit() {
    console.log(JSON.stringify(this.form.value));
    this.onSubmit.emit(this.form.value);
  }

  redraw() {
    this.ref.detectChanges();
  }

}
