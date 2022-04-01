import { NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { of, throwError } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { DateAdapter } from '../../../shared/dateAdapter';
import { MomentDateFormatter } from './../../../shared/dateFormat';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TemplateModalComponent } from './../template-modal/template-modal.component';
import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { NewComponent } from './new.component';

describe('NewComponent', () => {
  let component: NewComponent;
  let fixture: ComponentFixture<NewComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;
  let error: ErrorService;
  let modalService: NgbModal;
  let routeStub;
  let router: Router;

  let valid_request = {
    tn: '12345',
    fio: 'Иванов Иван Владимирович',
    login: 'IvanovIV',
    passport_issued: 'УФМС',
    date_passport: '2001-12-22',
    code_passport: '242-062',
    date_start: '2022-01-10',
    select_time: 1,
    general: 'в отношениях с государственными и муниципальными органами',
    sn_passport: '0110 123321',
    author_fio: 'Петров Петр Владимирович',
    author_login: 'PetrovPV',
    author_tn: '9876',
    array_authority: [
      'получение-передача документов'
    ],
  }
  routeStub = { data: of({}) };

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        NewComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NgbModule,
        BrowserModule
      ],
      providers: [
        RequestsService,
        FormBuilder,
        { provide: AuthHelper, useClass: AuthHelperStub },
        { provide: NgbDateParserFormatter, useValue: new MomentDateFormatter },
        { provide: NgbDateAdapter, useValue: new DateAdapter },
        { provide: ActivatedRoute, useValue: routeStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);
    router = TestBed.inject(Router);
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('init form is invalid', () => {
    component.ngOnInit();

    expect(component.form.valid).toBeFalsy();

    expect(component.form.controls['tn'].errors.required).toBeTruthy();
    expect(component.form.controls['sn_passport'].errors.required).toBeTruthy();
    expect(component.form.controls['passport_issued'].errors.required).toBeTruthy();
    expect(component.form.controls['date_passport'].errors.required).toBeTruthy();
    expect(component.form.controls['code_passport'].errors.required).toBeTruthy();
    expect(component.form.controls['date_start'].errors.required).toBeTruthy();
    expect(component.form.controls['general'].errors.required).toBeTruthy();
    expect(component.form.controls['array_authority'].errors.required).toBeTruthy();

    expect(component.form.controls['fio'].errors.required).toBeTruthy();
    expect(component.form.controls['login'].errors.required).toBeTruthy();
  });

  describe('run RequestResolver', () => {
    beforeEach(() => {
      router = TestBed.inject(Router)
      routeStub = TestBed.inject(ActivatedRoute)

      routeStub.data = of({presentRequest : valid_request });
    })

    it('assign data from resolver for form value', () => {
      fixture = TestBed.createComponent(NewComponent)
      component = fixture.componentInstance;

      component.ngOnInit();

      expect(component.form.controls['tn'].value).toEqual(valid_request.tn);
      expect(component.form.controls['sn_passport'].value).toEqual(valid_request.sn_passport);
      expect(component.form.controls['passport_issued'].value).toEqual(valid_request.passport_issued);
      expect(component.form.controls['date_passport'].value).toEqual(valid_request.date_passport);
      expect(component.form.controls['code_passport'].value).toEqual(valid_request.code_passport);
      expect(component.form.controls['date_start'].value).toEqual(valid_request.date_start);
      expect(component.form.controls['select_time'].value).toEqual(valid_request.select_time);
      expect(component.form.controls['general'].value).toEqual(valid_request.general);
      expect(component.form.controls['array_authority'].value).toEqual(valid_request.array_authority);
    });
  });

  describe('#findUser', () => {
    let data = {
      fio: "Иванов Иван Иванович",
      login: "IvanovII",
      tn: "12300"
    }

    it('should find user', () => {
      component.ngOnInit();

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findUserByTn').and.returnValue(of(data));

      component.findUser();

      expect(component.form.controls['fio'].value).toEqual(data.fio);
      expect(component.form.controls['login'].value).toEqual(data.login);
    });

    it('user not found', () => {
      component.ngOnInit();

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findUserByTn').and.returnValue(of({}));

      component.findUser();

      expect(component.form.controls['fio'].value).toEqual('');
      expect(component.form.controls['login'].value).toEqual('');
    });
  });

  describe('#getDuties', () => {
    let data = {
      duties: [
        'получение-передача документов',
        'выполнять все необходимые действия'
      ]
    }

    it('should call getDuties and get response as array data', () => {
      component.ngOnInit();

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'getDuties').and.returnValue(of(data));

      component.getDuties();

      expect(component.lists.length).toEqual(data.duties.length)
    });

    it('should get error form server', () => {
      component.ngOnInit();

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'getDuties').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.getDuties();

      expect(error.handling).toHaveBeenCalled();
    });
  });

  describe('#submit', () => {
    let data = new Blob(['test'], { type: 'application/json' });

    fit('should generate template file on server', () => {
      component.ngOnInit();

      component.form.patchValue(valid_request);
      component.addSelected('полномочие');

      modalService = TestBed.inject(NgbModal);
      spyOn(modalService, 'open').and.callFake((dlg, opt) => {
        return <NgbModalRef>({ componentInstance: new TemplateModalComponent(null, null, null, null, null) })
      })

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'templateFile').and.returnValue(of(data));
      spyOn(requestsService, 'checkAccessUserPrint').and.returnValue(of({result: true}));

      component.submit();

      expect(modalService.open).toHaveBeenCalled();
    });

    it('should get error form server', () => {
      component.ngOnInit();

      component.form.patchValue(valid_request);
      component.addSelected('полномочие');

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'templateFile').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.submit();

      expect(error.handling).toHaveBeenCalled();
    });
  });

});
