import { Component, OnInit, Input } from '@angular/core';
import { MappedFormGroup } from '../mapped-forms';
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

  form: MappedFormGroup;

  constructor(private ref: ChangeDetectorRef) {
    
  }

  ngOnInit() {
    this.form = new SchemaForm(this.schema).asFormGroup(this.value);
  }

  onSubmit() {
    console.log(JSON.stringify(this.form.value));
  }

  redraw() {
    this.ref.detectChanges();
  }

}
