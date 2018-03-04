import { AbstractControl } from '@angular/forms';
import { MappedFormControl, MappedFormGroup, MappedFormArray } from './mapped-forms';
import { Schema } from './schema';
import * as Ajv from 'ajv';

export class SchemaForm {
    constructor(public schema: object) {
    }

    asFormGroup(value: object) {
        return this.convertObjectSchema(this.schema, "", value);
    }

    convertSchema(schema: object, path: string, value: object, required: string[] = []): AbstractControl {
        let control: AbstractControl;
        switch (schema['type']) {
            case "object":
                control = this.convertObjectSchema(schema, path, value);
                break;
            case "array":
                control = this.convertArraySchema(schema, path, value);
                break;
            default:
                let isRequired = required.includes(this.pathTail(path))
                control = new MappedFormControl(schema, path, value, isRequired);
                break;
        }
        return control;  
    }

    schemaHasConditional(schema: object) {
        return (schema['if'] && (schema['then'] || schema['else']))
            || (schema['anyOf']);
    }

    applyConditional(schema: object, val: object): object {
        let result: object = null;
        if (schema['if']) {
            let ajv = new Ajv();
            let validate = ajv.compile(new Schema(schema['if']).nullOptionalsAllowed());
            let valid = validate(val);
            let apply: any = null;
            if (valid && schema['then']) {
                apply = schema['then'];
            } else if (!valid && schema['else']) {
                apply = schema['else'];
            }
            if (apply) {
                // recurse into conditionals of then/else schemas
                apply = this.applyConditional(apply, val) || apply;
                result = new Schema(schema).conjoin(apply);
            }
        }
        if (schema['anyOf']) {
            let ajv = new Ajv();
            let disjunction = null;
            for (let subSchema of <object[]>schema['anyOf']) {
                let validate = ajv.compile(new Schema(subSchema).nullOptionalsAllowed());
                if (validate(val)) {
                    let apply = this.applyConditional(subSchema, val) || subSchema;
                    disjunction = new Schema(disjunction).disjoin(apply);
                }
            }
            if (disjunction === null)
                throw "Current state of form illegal, no condition in anyOf is true";
            result = new Schema(result || schema).conjoin(disjunction);
        }

        return result;
    }

    convertObjectSchema(baseSchema: object, path: string, value: object): MappedFormGroup {
        let condSchema = this.applyConditional(baseSchema, value);
        let schema = condSchema || baseSchema;
        let control = this.convertObjectSchemaCore(schema, path, value);

        if (this.schemaHasConditional(baseSchema)) {
            let changing: boolean = false;
            control.valueChanges.subscribe(val => {
                if (changing) return;
                changing = true;
                let newSchema = this.applyConditional(baseSchema, val);
                let newControl = this.convertObjectSchemaCore(newSchema || baseSchema, path, val);
                this.applyChanges(control, newControl);
                changing = false;
            });
        }

        return control;
    }

    applyChanges(formGroup: MappedFormGroup, newFormGroup: MappedFormGroup) {
        let controlNames = [];
        for (let name in formGroup.controls) {
            if (!newFormGroup.controls[name]) {
                controlNames.push(name);
            } 
        }
        for (let name of controlNames) {
            formGroup.removeControl(name);
        }
        for (let name in newFormGroup.controls) {
            if (!formGroup.controls[name]) {
                let addControl = newFormGroup.get(name);
                newFormGroup.removeControl(name);
                formGroup.addControl(name, addControl);
            } else if (formGroup.controls[name] instanceof MappedFormGroup && newFormGroup.controls[name] instanceof MappedFormGroup) {
                this.applyChanges(<MappedFormGroup>formGroup.controls[name],
                    <MappedFormGroup>newFormGroup.controls[name]);
            }
        }
    }

    convertObjectSchemaCore(schema: object, path: string, value: object): MappedFormGroup {
        let group: { [key: string]: AbstractControl } = {};
        for (let propKey in schema['properties']) {
            let subSchema = schema['properties'][propKey];
            let subPath = this.combine(path, propKey);
            let subValue = value && value[propKey];
            group[propKey] = this.convertSchema(subSchema, subPath, subValue, schema['required']);
        }
        return new MappedFormGroup(group, schema, path);
    }

    convertArraySchema(schema: object, path: string, value: object): MappedFormArray {
        let valueArray = <object[]>(value || []);
        let itemSchema = schema['items'];
        let createItem: (v: object, i: number) => AbstractControl;
        if (itemSchema.type === "object" || itemSchema.type === "array") {
        createItem = (v, i) => this.convertSchema(itemSchema, path + "[" + i + "]", valueArray[i] || {});
        } else {
        createItem = (v, i) => new MappedFormControl(itemSchema, path + "[" + i + "]", valueArray[i] || {});
        }
        return new MappedFormArray(schema, path, valueArray, createItem);
    }

    combine(path: string, key: string): string {
        return !path ? key : path + "." + key;
    }

    pathTail(path: string) {
        let pos = path.lastIndexOf('.');
        if (pos < 0)
            return path;
        else
            return path.substr(pos + 1);
    }
}
