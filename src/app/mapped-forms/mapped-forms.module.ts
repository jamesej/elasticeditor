import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { MappedFormGroupComponent } from './mapped-form-group/mapped-form-group.component';
import { MappedFormComponent } from './mapped-form/mapped-form.component';
import { MappedFormControlComponent } from './mapped-form-control/mapped-form-control.component';
import { MappedFormTableComponent } from './mapped-form-table/mapped-form-table.component';
import { KeysPipe } from './keys.pipe';

import { MappedFormGroup, MappedFormControl } from './mapped-forms';
import { MappedFormArrayComponent } from './mapped-form-array/mapped-form-array.component';
import { CustomEditorSource } from './custom-editor-source';
import { MappedFormControlBase } from './mapped-form-control-base';

import { CustomEditorDirective } from './custom-editor.directive';

export { CustomEditorSource } from './custom-editor-source';
export { MappedFormControlBase } from './mapped-form-control-base';
export { MappedFormArray, MappedFormControl, MappedFormGroup } from './mapped-forms';

@NgModule({
  declarations: [
    MappedFormGroupComponent,
    MappedFormComponent,
    MappedFormControlComponent,
    KeysPipe,
    MappedFormArrayComponent,
    MappedFormTableComponent,
    MappedFormControlBase,
    CustomEditorDirective
  ],
  imports: [
    BrowserModule, ReactiveFormsModule
  ],
  exports: [
      MappedFormComponent, MappedFormControlBase
  ]
})
export class MappedFormsModule { }