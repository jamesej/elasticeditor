import { CustomEditorSource, MappedFormControlBase } from './mapped-forms/mapped-forms.module';
import { Type } from '@angular/core';
import { BooleanSwitchComponent } from './form-editor-catalogue/form-editor-catalogue.module';

export class AppEditorSource extends CustomEditorSource {
    getControl(fieldType: string): Type<MappedFormControlBase> {
        switch (fieldType)
        {
            case "boolean-switch":
                return BooleanSwitchComponent;
        }
        return null;
    }
}