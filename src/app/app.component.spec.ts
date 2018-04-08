import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MappedFormComponent } from './mapped-forms/mapped-form/mapped-form.component';
import { MappedFormGroupComponent } from './mapped-forms/mapped-form-group/mapped-form-group.component';
import { MappedFormControlComponent } from './mapped-forms/mapped-form-control/mapped-form-control.component';
import { MappedFormArrayComponent } from './mapped-forms/mapped-form-array/mapped-form-array.component';
import { KeysPipe } from './mapped-forms/keys.pipe';
import { ReactiveFormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        MappedFormGroupComponent,
        MappedFormComponent,
        MappedFormControlComponent,
        KeysPipe,
        MappedFormArrayComponent
      ],
      imports: [ ReactiveFormsModule ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
