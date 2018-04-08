import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[customEditor]'
})
export class CustomEditorDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}