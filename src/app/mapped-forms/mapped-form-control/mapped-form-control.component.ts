import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, Input, ComponentFactoryResolver } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { MappedFormArray, MappedFormGroup, MappedFormControl } from '../mapped-forms';
import { Schema } from '../schema';
import { CustomEditorDirective } from '../custom-editor.directive';
import { CustomEditorSource } from '../custom-editor-source';
import { MappedFormControlBase } from '../mapped-form-control-base';

@Component({
  selector: 'app-mapped-form-control',
  templateUrl: './mapped-form-control.component.html',
  styleUrls: ['./mapped-form-control.component.css']
})
export class MappedFormControlComponent implements AfterViewInit, OnInit {
  @Input() form: FormGroup | FormArray;
  @Input() key: string;
  @Input() hideLabel: boolean = false;
  @ViewChildren(CustomEditorDirective) customEditors: QueryList<CustomEditorDirective>;

  public schema: object;
  isCustom: boolean = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private controlSource: CustomEditorSource) {
  }

  ngOnInit() {
    if (!!this.form['at']) {
        this.schema = (<MappedFormArray>this.form).schema['items'];
    } else {
        this.schema = (<MappedFormGroup>this.form.get(this.key)).schema;
    }
}

  ngAfterViewInit() {
    let fieldType = new Schema(this.schema).fieldType;
    let customControl = this.controlSource.getControl(fieldType);
    if (customControl != null) {
      this.customEditors.changes.subscribe((customEds: QueryList<CustomEditorDirective>) =>
      {
        if (customControl !== null) {
          let componentFactory = this.componentFactoryResolver.resolveComponentFactory(customControl);

          let viewContainerRef = customEds.first.viewContainerRef;
          viewContainerRef.clear();

          let componentRef = viewContainerRef.createComponent(componentFactory);
          componentRef.instance.form = this.form;
          componentRef.instance.key = this.key;
          if (this.schema['editorParams']) {
            componentRef.instance['params'] = this.schema['editorParams'];
          }
        }
      });
    }
    this.isCustom = (customControl != null);
  }

  get control(): MappedFormControl {
    if (!!this.form['at']) {
        return <MappedFormControl>(<MappedFormArray>this.form).at(parseInt(this.key));
    } else {
        return <MappedFormControl>(this.form.get(this.key));
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

  get controlType(): string {
      return new Schema(this.schema).fieldType;
  }
}
