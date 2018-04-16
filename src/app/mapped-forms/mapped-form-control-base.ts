import { FormArray, FormGroup } from "@angular/forms";
import { Component, Input, OnInit } from '@angular/core';
import { MappedFormArray, MappedFormGroup, MappedFormControl } from './mapped-forms';

@Component({
    selector: 'app-mapped-form-control-base',
    template: ''
})
export class MappedFormControlBase {
    private _form: FormGroup | FormArray;
    private _key: string;
    
    @Input()
    public set key(k: string) {
        this._key = k;
        this.setSchema();
    }
    public get key() {
        return this._key;
    }

    public schema: object = null;

    @Input()
    public set form(fm: FormGroup | FormArray) {
        this._form = fm;
        this.setSchema();
    }
    public get form(): FormGroup | FormArray {
        return this._form;
    }

    protected setSchema(): boolean {
        let doSet: boolean = (!this.schema && ((!!this._form) && (!!this._key)));
        if (doSet) {
            if (!!this._form['at']) {
                this.schema = (<MappedFormArray>this._form).schema['items'];
            } else {
                this.schema = (<MappedFormGroup>this._form.get(this.key)).schema;
            }
        }
        return doSet;
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