import { Injectable } from '@angular/core';
import { DataEngineService } from '../data-abstractions/data-engine-service';
import { SchemaSource } from '../data-abstractions/schema-source';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch'; 

@Injectable()
export class ElasticDataEngine implements DataEngineService {
    private indexBase: string = "data_";
    private urlBase: string = "http://localhost:9200/";

    constructor(private http: HttpClient, private schemas: SchemaSource ) {

    }

    read(type: string, id: string): object {
        return null;
    }

    write(type: string, data: object) {

    }

    ensureIndex(type: string) {
        return this.http.head(this.urlBase + this.indexBase + type, { observe: "response" })
            .catch((err, caught) => {
                if (err.status == 404)
                    return this.http.put<object>(this.urlBase + this.indexBase + type + "/_mapping/_doc",
                        this.fieldMapToElasticType(this.schemas[type]));
                else
                    return of({});
            })
            .subscribe(v => console.log(v));
    }

    fieldMapToElasticType(fieldMap: object): object {
        let et = {};
        switch (fieldMap['$type']) {
            case "object":
                et['properties'] = {};
                for (let key in fieldMap) {
                    if (key == '$type')
                        continue;
                    et['properties'][key] = this.fieldMapToElasticType(fieldMap[key]);
                }
                break;
            case "array":
                if (fieldMap['$items']['$type'] == 'object') {
                    et['type'] = 'nested';
                    et['dynamic'] = 'false';
                    et['properties'] = {};
                    let props = fieldMap['$items']['properties'];
                    for (let key in props) {
                        if (key == '$type')
                            continue;
                        et['properties'][key] = this.fieldMapToElasticType(props[key]);
                    }
                } else {
                    et['type'] = fieldMap['$items']['$type'];
                }
                break;
            default:
                et['type'] = this.elasticType(fieldMap['$type']);
                break;
        }
        return et;
    }

    elasticType(fmType: string): string {
        switch (fmType) {
            case 'number':
                return 'double';
            case 'string':
                return 'keyword';
            case 'datetime':
            case 'date':
            case 'time':
                return 'date';
            default: // boolean, integer
                return fmType;
        }
    }
}