import { FormGroup, FormControl, FormArray, AbstractControl, Validators, ValidatorFn } from '@angular/forms';

export class MappedFormControl extends FormControl {
    public id: number = Math.floor(Math.random() * 10000);
    public title: string;
    public description: string;

    static schemaValidators(required: boolean, schema: object): ValidatorFn[] {
        let validators = [];
        if (required) {
            validators.push(Validators.required);
        }
        let validatorMap = {
            maxLength: 'maxLength',
            minLength: 'minLength',
            pattern: 'pattern',
            minimum: 'min',
            maximum: 'max'
        }

        for (let schemaKey in validatorMap) {
            if (schema[schemaKey]) {
                validators.push(Validators[validatorMap[schemaKey]](schema[schemaKey]));
            }
        }

        if (schema['format']) {
            switch (schema['format']) {
                case 'email':
                    validators.push(Validators.email);
                    break;
            }
        }

        return validators;
    }

    constructor(public schema: object, public path: string, value: object, public required: boolean = false) {
        super(value, {
            validators: MappedFormControl.schemaValidators(required, schema)
        });
        this.title = schema['title'];
        this.description = schema['description'];
    }
}

export class MappedFormGroup extends FormGroup {
    constructor(group: { [key: string]: AbstractControl }, public schema: object, public path: string) {
        super(group);
    }
}

export class MappedFormArray extends FormArray {
    constructor(public schema: object, public path: string, valueArray: object[], public createItem: (v: object, i: number) => AbstractControl) {
        super((valueArray || []).map(createItem));
    }
}