import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { MappedFormGroupComponent } from './mapped-form-group/mapped-form-group.component';
import { MappedFormComponent } from './mapped-form/mapped-form.component';
import { MappedFormControlComponent } from './mapped-form-control/mapped-form-control.component';
import { KeysPipe } from './keys.pipe';

import { MappedFormGroup, MappedFormControl } from './mapped-forms';
import { MappedFormArrayComponent } from './mapped-form-array/mapped-form-array.component';


@NgModule({
  declarations: [
    AppComponent,
    MappedFormGroupComponent,
    MappedFormComponent,
    MappedFormControlComponent,
    KeysPipe,
    MappedFormArrayComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
