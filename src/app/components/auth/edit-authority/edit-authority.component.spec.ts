import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';

import { RequestsService } from './../../../services/requests.service';
import { EditAuthorityComponent } from './edit-authority.component';

describe('ChancelleryComponent', () => {
  let component: EditAuthorityComponent;
  let fixture: ComponentFixture<EditAuthorityComponent>;

  let requestsService: RequestsService;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        EditAuthorityComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgbModule,
        ReactiveFormsModule

      ],
      providers: [
        RequestsService,
        NgbActiveModal,
        FormBuilder,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAuthorityComponent);
    component = fixture.componentInstance;

    formBuilder = TestBed.inject(FormBuilder);

    component.ngOnInit();
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('when get new authority', function () {
    it('name for component', () => {
      expect(component.name).toEqual('Добавить полномочие');
    });

    it('init form is invalid', () => {
      expect(component.form.valid).toBeFalsy();

      expect(component.form.controls['name'].errors.required).toBeTruthy();
    });

    it('init form is valid', () => {
      component.form.controls['name'].setValue('Полномочие 32')

      expect(component.form.valid).toBeTruthy();
    });

    it('should call method addAuthority on save()', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'addAuthority').and.returnValue(of([]));

      component.save();

      expect(requestsService.addAuthority).toHaveBeenCalled();
    });
  });

  describe('when get present authority', function () {
    beforeEach(() => {
      component.el = {
        data: [
          {
            tn: 211,
            fio: "Боровая О.В.",
            fullname: "Боровая Ольга Васильевна"
          }
        ],
        duty: "test",
        id: 1,
        state: 1
      };

      fixture.detectChanges();
    });

    it('name for component', () => {
      expect(component.name).toEqual('Редактирование полномочия');
    });

    it('init form is valid', () => {
      expect(component.form.valid).toBeTruthy();
    });

    it('should call method updateAuthority on save()', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'updateAuthority').and.returnValue(of([]));

      component.save();

      expect(requestsService.updateAuthority).toHaveBeenCalled();
    });
  });

  describe('#onChangeTn', function () {
    it('should return object user for onChangeTn method', () => {
      let response = {
        fio: "Боровая Ольга Васильевна",
        login: "BorovayaOV",
        tn: "211"
      }

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findUserByTn').and.returnValue(of(response));

      component.onChangeTn(0, 211);

      expect(component.fullnames[0]).toEqual(response.fio)
    });

    it('should return nil for onChangeTn method', () => {
      let user_not_found = 'Пользователь не найден';

      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'findUserByTn').and.returnValue(of({}));

      component.onChangeTn(0, 123);

      expect(component.fullnames[0]).toEqual(user_not_found)
    });

    it('should return th user for onChangeTn method', () => {
      let new_tn = '111';

      component.onAddSTns();
      component.form.controls['tns'].setValue([new_tn])

      expect(component.form.controls['tns'].value).toEqual([new_tn])
    });
  });
});
