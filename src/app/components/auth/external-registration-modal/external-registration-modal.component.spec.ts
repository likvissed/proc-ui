import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalRegistrationModalComponent } from './external-registration-modal.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { of, throwError } from 'rxjs';

describe('ExternalRegistrationModalComponent', () => {
  let component: ExternalRegistrationModalComponent;
  let fixture: ComponentFixture<ExternalRegistrationModalComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;
  let error: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalRegistrationModalComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule
      ],
      providers: [
        RequestsService,
        NgbActiveModal,
        FormBuilder,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRegistrationModalComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('init form is invalid', () => {
    expect(component.form.valid).toBeFalsy();

    expect(component.form.controls['deloved_id'].errors.required).toBeTruthy();
    expect(component.form.controls['fio'].errors.required).toBeTruthy();
    expect(component.form.controls['start_date'].errors.required).toBeTruthy();
    expect(component.form.controls['end_date'].errors.required).toBeTruthy();
    expect(component.form.controls['file'].errors.required).toBeTruthy();
  });

  describe('#uploadFile', () => {
    const file =  new Blob(['test'], { type: 'application/pdf' });
    const fileList: FileList = { length: 1, item: () => null, 0: file as File };
    const event = { currentTarget: { files: fileList } } as any;

    it('file upload and append formData', () => {
      component.uploadFile(event);

      expect(component.formData.get('file')).not.toEqual('');
    });
  });

  describe('#onSubmit', function () {
    it('should call method registrationExternalDoc', () => {
      component.form.controls['deloved_id'].setValue(987);

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'registrationExternalDoc').and.returnValue(of([]));

      component.onSubmit();

      expect(requestsService.registrationExternalDoc).toHaveBeenCalled();
    });

    it('should get error form server', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'registrationExternalDoc').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.onSubmit();

      expect(error.handling).toHaveBeenCalled();
    });
  });

});
