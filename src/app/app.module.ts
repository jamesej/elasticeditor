import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MappedFormsModule, CustomEditorSource } from './mapped-forms/mapped-forms.module';
import { DataElasticModule } from './data-elastic/data-elastic.module';
import { FormEditorCatalogueModule } from './form-editor-catalogue/form-editor-catalogue.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule, MappedFormsModule,
    DataElasticModule.forRoot(),
    FormEditorCatalogueModule
  ],
  providers: [
    CustomEditorSource
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
