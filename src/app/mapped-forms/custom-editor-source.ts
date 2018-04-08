import { Type } from '@angular/core';
import { MappedFormControlBase } from './mapped-form-control-base';

export class CustomEditorSource {
    constructor() {

    }

    getControl(fieldType: string): Type<MappedFormControlBase> {
        return null;
    }
}