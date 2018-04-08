import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ElasticDataEngine } from './elastic-data-engine';

@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class DataElasticModule {
    static forRoot(): ModuleWithProviders {
        return {
          ngModule: DataElasticModule,
          providers: [ElasticDataEngine]
        };
    }
}