import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MappedFormsModule } from '../mapped-forms/mapped-forms.module';
import { BooleanSwitchComponent } from './boolean-switch/boolean-switch.component';

export { BooleanSwitchComponent } from './boolean-switch/boolean-switch.component';

@NgModule({
  declarations: [
      BooleanSwitchComponent
  ],
  imports: [
    CommonModule, ReactiveFormsModule
  ],
  exports: [
      BooleanSwitchComponent
  ]
})
export class FormEditorCatalogueModule { }