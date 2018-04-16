import { Component, OnInit, AfterViewInit, ViewChild, QueryList, Input, ComponentFactoryResolver, Type } from '@angular/core';
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
export class MappedFormControlComponent extends MappedFormControlBase implements OnInit {
  @Input() hideLabel: boolean = false;
  @ViewChild(CustomEditorDirective) customEditor: CustomEditorDirective;

  isCustom: boolean = false;
  customControl: Type<MappedFormControlBase>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private controlSource: CustomEditorSource) {
      super();
  }

  protected setSchema(): boolean {
    if (super.setSchema()) {
      let fieldType = new Schema(this.schema).fieldType;
      this.customControl = this.controlSource.getControl(fieldType);
      this.isCustom = (this.customControl != null);
      return true;
    }
    return false;
  }

  ngOnInit() {
    if (this.isCustom) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.customControl);

      let viewContainerRef = this.customEditor.viewContainerRef;
      viewContainerRef.clear();

      let componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.key = this.key;
      componentRef.instance.form = this.form;
      if (this.schema['editorParams']) {
        componentRef.instance['params'] = this.schema['editorParams'];
      }
    }
  }

  get controlType(): string {
      return new Schema(this.schema).fieldType;
  }
}
