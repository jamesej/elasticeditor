import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MappedFormsModule } from './mapped-forms/mapped-forms.module';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule, MappedFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
