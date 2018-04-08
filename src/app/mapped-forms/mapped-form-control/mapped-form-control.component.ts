import { Component, OnInit, ViewChild, Input, ComponentFactoryResolver } from '@angular/core';
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
export class MappedFormControlComponent extends MappedFormControlBase {
  @Input() hideLabel: boolean = false;
  @ViewChild(CustomEditorDirective) customEditor: CustomEditorDirective;

  isCustom: boolean = false;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private controlSource: CustomEditorSource) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    let fieldType = new Schema(this.schema).fieldType;
    let customControl = this.controlSource.getControl(fieldType);
    if (customControl) {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(customControl);

      let viewContainerRef = this.customEditor.viewContainerRef;
      viewContainerRef.clear();

      let componentRef = viewContainerRef.createComponent(componentFactory);
      componentRef.instance.form = this.form;
      componentRef.instance.key = this.key;
      if (this.schema['editorParams']) {
        componentRef.instance['params'] = this.schema['editorParams'];
      }
      this.isCustom = true;
    }
  }

  get controlType(): string {
      return new Schema(this.schema).fieldType;
  }
}
