import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MappedFormsModule, CustomEditorSource } from './mapped-forms/mapped-forms.module';
import { DataElasticModule } from './data-elastic/data-elastic.module';
import { FormEditorCatalogueModule, BooleanSwitchComponent } from './form-editor-catalogue/form-editor-catalogue.module';
import { AppEditorSource } from './app-editor-source';

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
    { provide: CustomEditorSource, useClass: AppEditorSource }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ BooleanSwitchComponent ]
})
export class AppModule { }
