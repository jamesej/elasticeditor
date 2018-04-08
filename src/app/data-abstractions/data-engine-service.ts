import { Injectable } from '@angular/core';

@Injectable()
export abstract class DataEngineService {
  abstract read(type: string, id: string): object;
  abstract write(type: string, data: object);
}