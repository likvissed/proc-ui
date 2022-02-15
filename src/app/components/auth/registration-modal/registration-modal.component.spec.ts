import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { RegistrationModalComponent } from "./registration-modal.component";

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { of, throwError } from 'rxjs';

describe('RegistrationModalComponent', () => {
  let component: RegistrationModalComponent;
  let fixture: ComponentFixture<RegistrationModalComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;
  let error: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegistrationModalComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        RequestsService,
        NgbActiveModal,
        FormBuilder,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationModalComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    component.ngOnInit();
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('init form is invalid', () => {
    expect(component.form.valid).toBeFalsy();

    expect(component.form.controls['id'].errors.required).toBeTruthy();
    expect(component.form.controls['deloved_id'].errors.required).toBeTruthy();
    expect(component.form.controls['file'].errors.required).toBeTruthy();
  });

  describe('#findDocument', () => {
    beforeEach(() => {
      component.form.controls['id'].setValue(id_doc);
    });

    let id_doc = 121;
    let data = {
      author_fio: "Иванов Иван Иванович",
      date_end: "29.12.2021",
      date_start: "30.11.2021",
      fio: "Иванов Иван Иванович",
      state: 5
    }

    it('should call method findDocument and assign obj', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findDocument').and.returnValue(of(data));

      component.findDocument();

      expect(component.form.controls['state'].value).toEqual(data.state)
      expect(component.form.controls['date_start'].value).toEqual(data.date_start)
      expect(component.form.controls['date_end'].value).toEqual(data.date_end)
      expect(component.form.controls['fio'].value).toEqual(data.fio)
    });

    it('should get error form server', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findDocument').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.findDocument();

      expect(error.handling).toHaveBeenCalled();
    });
  });

  it('should changed values for data', () => {
    let blank_val = '';

    component.changeId();

    expect(component.form.controls['state'].value).toEqual(blank_val)
    expect(component.form.controls['date_start'].value).toEqual(blank_val)
    expect(component.form.controls['date_end'].value).toEqual(blank_val)
    expect(component.form.controls['fio'].value).toEqual(blank_val)
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

  describe('#saveFile', function () {
    it('should call method withdrawDocument', () => {
      component.form.controls['deloved_id'].setValue(987);

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'registrationDocument').and.returnValue(of([]));

      component.saveFile();

      expect(requestsService.registrationDocument).toHaveBeenCalled();
    });

    it('should get error form server', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'registrationDocument').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.saveFile();

      expect(error.handling).toHaveBeenCalled();
    });
  });

});
