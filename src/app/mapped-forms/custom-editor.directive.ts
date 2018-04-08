import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[custom-editor]',
})
export class CustomEditorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}