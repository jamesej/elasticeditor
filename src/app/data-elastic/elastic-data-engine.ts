import { Injectable } from '@angular/core';
import { DataEngineService } from '../data-abstractions/data-engine-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch'; 

@Injectable()
export class ElasticDataEngine implements DataEngineService {
    private index: string = "data";
    private urlBase: string = "http://localhost:9200/";

    constructor(private http: HttpClient) {

    }

    read(type: string, id: string): object {
        return null;
    }

    write(type: string, data: object) {

    }

    ensureIndex() {
        return this.http.head(this.urlBase + this.index, { observe: "response" })
            .catch((err, caught) => {
                if (err.status == 404)
                    return this.http.put(this.urlBase + this.index, {});
                else
                    return of({});
            })
            .subscribe(v => console.log(v));
    }
}