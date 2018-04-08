import { FormArray, FormGroup } from "@angular/forms";
import { Component, Input, OnInit } from '@angular/core';
import { MappedFormArray, MappedFormGroup, MappedFormControl } from './mapped-forms';

@Component({
    selector: 'app-mapped-form-control-base',
    template: ''
})
export class MappedFormControlBase implements OnInit {
    @Input() form: FormGroup | FormArray;
    @Input() key: string;

    public schema: object;

    ngOnInit() {
        if (!!this.form['at']) {
            this.schema = (<MappedFormArray>this.form).schema['items'];
        } else {
            this.schema = (<MappedFormGroup>this.form.get(this.key)).schema;
        }
    }

    get control(): MappedFormControl {
        if (!!this.form['at']) {
            return <MappedFormControl>(<MappedFormArray>this.form).at(parseInt(this.key));
        } else {
            return <MappedFormControl>(this.form.get(this.key));
        }
    }

    get title(): string {
        return this.control.title || this.key;
    }

    get classes(): string {
        if (this.showInvalid) {
            return "is-invalid";
        } else {
            return "is-valid";
        }
    }
    
    get showInvalid(): boolean {
        return this.control.invalid && (this.control.dirty || this.control.touched);
    }
}