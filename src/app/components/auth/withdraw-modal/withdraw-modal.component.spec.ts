import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { WithdrawModalComponent } from './withdraw-modal.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';

describe('WithdrawModalComponent', () => {
  let component: WithdrawModalComponent;
  let fixture: ComponentFixture<WithdrawModalComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;
  let error: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WithdrawModalComponent
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

    fixture = TestBed.createComponent(WithdrawModalComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    component.id_document = 123;
    component.ngOnInit();
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('init form is invalid', () => {
    expect(component.form.valid).toBeFalsy();

    expect(component.form.controls['reason'].errors.required).toBeTruthy();
  });

  it('original received', () => {
    component.onCheckChange();

    expect(component.form.controls['reason_document'].value).toEqual('');
  });

  describe('#send', function () {
    it('should call method withdrawDocument', () => {
      let data = { result: `Доверенность №${component.id_document} отозвана` };

      component.form.controls['reason'].setValue('Причина')

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'withdrawDocument').and.returnValue(of(data));

      component.send();

      expect(requestsService.withdrawDocument).toHaveBeenCalled();
    });

    it('should get error form server', () => {
      component.form.controls['reason'].setValue('Причина')

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'withdrawDocument').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.send();

      expect(error.handling).toHaveBeenCalled();
    });
  });
});
