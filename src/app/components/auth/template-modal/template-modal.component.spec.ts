import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TemplateModalComponent } from "./template-modal.component";

import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { of, throwError } from 'rxjs';

describe('TemplateModalComponent', () => {
  let component: TemplateModalComponent;
  let fixture: ComponentFixture<TemplateModalComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;
  let error: ErrorService;

  const request = {
    tn: '12345',
    fio: 'Иванов Иван Владимирович',
    login: 'IvanovIV',
    passport_issued: 'УФМС',
    date_passport: '2001-12-22',
    code_passport: '242-062',
    date_start: '2022-01-10',
    select_time: 1,
    general: 'в отношениях с государственными и муниципальными органами',
    array_authority: [
      'получение-передача документов',
      'выполнять все необходимые действия',
      'прочее полномочие'
    ],
    sn_passport: '0110 123321',
    author_fio: 'Петров Петр Владимирович',
    author_login: 'PetrovPV',
    author_tn: '9876'
  }
  const templateFile =  new Blob(['test'], { type: 'application/pdf' });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemplateModalComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        RequestsService,
        NgbActiveModal,
        { provide: AuthHelper, useClass: AuthHelperStub}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateModalComponent);
    component = fixture.componentInstance;

    component.request = request;
    component.templateFile = templateFile;
    window.URL.createObjectURL = jest.fn();

    component.ngOnInit();
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('#sendToSsd', function () {
    it('should call method sendForApproval', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'sendForApproval').and.returnValue(of([]));

      component.sendToSsd();

      expect(requestsService.sendForApproval).toHaveBeenCalled();
    });

    it('should get error form server', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'sendForApproval').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.sendToSsd();

      expect(error.handling).toHaveBeenCalled();
    });
  });

});
