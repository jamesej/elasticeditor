import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MappedFormsModule } from './mapped-forms/mapped-forms.module';
import { DataElasticModule } from './data-elastic/data-elastic.module';
import { CustomEditorSource } from './mapped-forms/custom-editor-source';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [ ReactiveFormsModule, MappedFormsModule, DataElasticModule.forRoot() ],
      providers: [
        CustomEditorSource
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
