import { PropertyWrite } from "@angular/compiler";

export class Schema {
    constructor(public schemaObject: object) {
    }

    get fieldType(): string {
        let type = this.schemaObject['type'];
        if (this.schemaObject['format'])
          type += " " + this.schemaObject['format'];
        if (this.schemaObject['enum'])
          type = "enum";
        if (this.schemaObject['hidden'])
          type = "hidden";
        if (this.schemaObject['editor'])
          type = this.schemaObject['editor'];
        switch (type) {
          case "string date-time":
          case "string date":
          case "string time":
          case "string email":
            return this.schemaObject['format'];
          default:
            return type;
        }
      }

    // manipulate the schema to allow any optional property to have a null value
    // which is appropriate for form input
    nullOptionalsAllowed(): object {
        let newSchema = Schema.deepCopy(this.schemaObject);
        this.nullOptionalsAllowedApply(newSchema);
        return newSchema;
    }

    private nullOptionalsAllowedApply(schema: object) {
        let req : Array<string> = schema['required'] || [];
        switch (schema['type']) {
            case 'object':
                for (let prop in schema['properties']) {
                    if (req.indexOf(prop) < 0) {
                        this.nullOptionalsAllowedApply(schema['properties'][prop]);
                    }
                }
                break;
            case 'array':
                this.nullOptionalsAllowedApply(schema['items']);
                break;
            default:
                if (Array.isArray(schema['type'])) {
                    if (schema['type'].indexOf('null') < 0) {
                        schema['type'].push('null');
                    }
                } else if (schema['type'] != 'null') {
                    schema['type'] = [schema['type'], 'null'];
                }
                break;
        }
    }

    public conjoin(schema: object): object {
        if (schema instanceof Schema) {
            schema = (<Schema>schema).schemaObject;
        }
        return this.conjoinFunc(this.schemaObject, schema);
    }
    private conjoinFunc(schema0: object, schema1: object): object {
        if (Schema.isEmpty(schema0))
            return Schema.deepCopy(schema1);

        let schema = Schema.deepCopy(schema0);

        for (let prop in schema1) {
            switch (prop) {
                case 'properties':
                    if (!schema['properties']) {
                        schema['properties'] = {};
                    }
                    for (let p in schema1['properties']) {
                        let res = this.conjoinFunc(schema['properties'][p], schema1['properties'][p]);
                        if (res === null) {
                            delete schema['properties'][p];
                        } else {
                            schema['properties'][p] = res
                        }
                    }
                    break;
                case 'items':
                    schema['items'] = this.conjoinFunc(schema['items'], schema1['items']);
                    break;
                case 'type':
                case 'enum':
                case 'const':
                    let val1 = schema1[prop];
                    let val = schema[prop];
                    if (!val) {
                        if (prop == 'enum' && schema['const']) {
                            val = schema['const'];
                        } else if (prop == 'const' && schema['enum']) {
                            val = schema['enum'];
                        } else {
                            schema[prop] = schema1[prop];
                            break;
                        }
                    }
                    if (!Array.isArray(val1)) {
                        val1 = [val1];
                    }
                    if (!Array.isArray(val)) {
                        val = [val];
                    }
                    schema[prop] = Schema.intersection<string>(<string[]>val1, <string[]>val);
                    if (schema[prop] == []) {
                        return null;
                    }
                    if (prop == 'type' && schema['type'].length == 1) {
                        schema['type'] = schema['type'][0];
                    } else if (prop == 'enum' && schema['enum'].length == 1) {
                        schema['const'] = schema['enum'][0];
                        delete schema['enum'];
                    } else if (prop == 'const') {
                        if (schema['const'].length == 1) {
                            schema['const'] = schema['const'][0];
                        } else {
                            schema['enum'] = schema['const'];
                            delete schema['const'];
                        }
                    }
                    break;
                case 'required':
                    schema[prop] = Schema.union<string>(<string[]>schema[prop], <string[]>schema1[prop]);
                    break;
                case 'maximum':
                case 'exclusiveMaximum':
                case 'maxLength':
                case 'maxItems':
                case 'maxProperties':
                    if (schema[prop] > schema1[prop]) {
                        schema[prop] = schema1[prop];
                    }
                case 'minimum':
                case 'exclusiveMinimum':
                case 'minLength':
                case 'minItems':
                case 'minProperties':
                    if (schema[prop] < schema1[prop]) {
                        schema[prop] = schema1[prop];
                    }
                case 'if':
                case 'then':
                case 'else':
                case 'anyOf':
                case 'allOf':
                    break;
                default:
                    if (schema[prop] && schema[prop] != schema1[prop])
                        return null;
                    schema[prop] = schema1[prop];
                    break;
            }
        }

        return schema;
    }

    public disjoin(schema: object): object {
        if (schema instanceof Schema) {
            schema = (<Schema>schema).schemaObject;
        }
        return this.disjoinFunc(this.schemaObject, schema);
    }
    private disjoinFunc(schema0: object, schema1: object): object {
        if (schema0 === null)
            return schema1;
        else if (schema1 === null)
            return schema0;

        let schema = Schema.deepCopy(schema0);
        
        for (let prop in schema1) {
            switch (prop) {
                case 'properties':
                    let deleteProps = [];
                    for (let p in schema['properties']) {
                        let otherProp = schema1['properties'][p] || null;
                        if (otherProp === null) {
                            deleteProps.push(p);
                        } else {
                            let res = this.disjoinFunc(schema['properties'][p], otherProp);
                            if (Schema.isEmpty(res))
                                throw "Disjoining property " + p + " means it has no definition";
                            schema['properties'][p] = res
                        }
                    }
                    break;
                case 'items':
                    schema['items'] = this.disjoinFunc(schema['items'], schema1['items']);
                    break;
                case 'type':
                case 'enum':
                case 'const':
                    let val1 = schema1[prop];
                    let val = schema[prop];
                    if (!val) {
                        if (prop == 'enum' && schema['const']) {
                            val = schema['const'];
                        } else if (prop == 'const' && schema['enum']) {
                            val = schema['enum'];
                        } else {
                            schema[prop] = schema1[prop];
                            break;
                        }
                    }
                        
                    if (!Array.isArray(val1)) {
                        val1 = [val1];
                    }
                    if (!Array.isArray(val)) {
                        val = [ val ];
                    }
                    schema[prop] = Schema.union<string>(<string[]>val1, <string[]>val);
                    if (prop == 'type' && schema['type'].length == 1) {
                        schema['type'] = schema['type'][0];
                    } else if (prop == 'enum' && schema['enum'].length == 1) {
                        schema['const'] = schema['enum'][0];
                        delete schema['enum'];
                    } else if (prop == 'const') {
                        if (schema['const'].length == 1) {
                            schema['const'] = schema['const'][0];
                        } else {
                            schema['enum'] = schema['const'];
                            delete schema['const'];
                        }
                    }
                    break;
                case 'required':
                    if (!schema[prop])
                        schema[prop] = schema1[prop];
                    else
                        schema[prop] = Schema.intersection<string>(<string[]>schema[prop], <string[]>schema1[prop]);
                    break;
                case 'maximum':
                case 'exclusiveMaximum':
                case 'maxLength':
                case 'maxItems':
                case 'maxProperties':
                    if (schema[prop] <= schema1[prop]) {
                        schema[prop] = schema1[prop];
                    }
                case 'minimum':
                case 'exclusiveMinimum':
                case 'minLength':
                case 'minItems':
                case 'minProperties':
                    if (schema[prop] >= schema1[prop]) {
                        schema[prop] = schema1[prop];
                    }
                default:
                    if (schema[prop] && schema[prop] != schema1[prop])
                        throw "Property " + prop + " has different undisjoinable values";
                    schema[prop] = schema1[prop];
                    break;
            }
        }

        return schema;
    }

    public asFieldMap(): object {
        return this.fieldUnion(this.schemaObject);
    }

    private fieldUnion(schema: object): object {
        if (!schema['type'])
            throw "object not well-formed schema in fieldUnion, no type field";
        schema = this.expandConditionals(schema);
        let s = new Schema(schema);
        let union = {
            type: s.fieldType
        };
        switch (schema['type']) {
            case "object":
                let props = schema['properties'];
                for (let field in props) {
                    union[field] = this.fieldUnion(props[field]);
                }
                break;
            case "array":
                union['items'] = this.fieldUnion(schema['items']);
                break;
        }
        return union;
    }

    private expandConditionals(schema: object): object {
        let conditionalParts = [];
        if (schema['then']) {
            conditionalParts.push(schema['then']);
        }
        if (schema['else']) {
            conditionalParts.push(schema['else']);
        }
        if (schema['anyOf']) {
            conditionalParts = conditionalParts.concat(schema['anyOf']);
        }
        if (schema['allOf']) {
            conditionalParts = conditionalParts.concat(schema['allOf']);
        }
        for (let subSchema of conditionalParts) {
            schema = this.conjoinFunc(schema, this.expandConditionals(subSchema));
        }
        return schema;
    }
    

    public static intersection<T>(arr0: T[], arr1: T[]): T[] {
        let output = new Array<T>();
        for (let val of arr0) {
            if (arr1.indexOf(val) >= 0) {
                output.push(val);
            }
        }
        return output;
    }

    public static union<T>(arr0: T[], arr1: T[]): T[] {
        let output = new Array<T>();
        for (let val of arr0) {
            output.push(val);
        }
        for (let val of arr1) {
            if (arr1.indexOf(val) < 0) {
                output.push(val);
            }
        }
        return output;
    }

    public static isEmpty(map: object): boolean {
        for(var key in map) {
           return !map.hasOwnProperty(key);
        }
        return true;
     }

    public static deepCopy(obj): object {
        var copy;
    
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
    
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
    
        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.deepCopy(obj[i]);
            }
            return copy;
        }
    
        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
            }
            return copy;
        }
    
        throw new Error("Unable to copy obj! Its type isn't supported.");
    }
}
