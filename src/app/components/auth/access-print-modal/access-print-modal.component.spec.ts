import { ConfirmationDialogService } from './../../../services/confirmation-dialog.service';
import { NotificationService } from './../../../services/notification.service';
import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AccessPrintModalComponent } from './access-print-modal.component';
import { of, throwError } from 'rxjs';

describe('AccessPrintModalComponent', () => {
  let component: AccessPrintModalComponent;
  let fixture: ComponentFixture<AccessPrintModalComponent>;

  let requestsService: RequestsService;
  let error: ErrorService;
  let notification: NotificationService;
  let confirmaDialog: ConfirmationDialogService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessPrintModalComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        NgbActiveModal,
        FormBuilder,
        RequestsService,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessPrintModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  let tn_user = 123;
  let data = {
    id: 1,
    fio: "Иванов Иван Иванович",
    dept: "714",
    phone: "11-11",
    tn: tn_user,
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('init form is invalid', () => {
    expect(component.form.valid).toBeFalsy();

    expect(component.form.controls['tn'].errors.required).toBeTruthy();
  });

  describe('#onLoadLists', () => {
    beforeEach(() => {
      component.form.controls['tn'].setValue(tn_user);
    });

    let tn_user = 123;

    it('should call method getUsersPrint and assign obj', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'getUsersPrint').and.returnValue(of({users:[data]}));

      component.onLoadLists();

      expect(component.form.controls['tn'].value).toEqual(data.tn);

      expect(component.lists[0]).toEqual(data);
    });

    it('should get error form server', () => {
      requestsService = TestBed.inject(RequestsService);
      spyOn(requestsService, 'getUsersPrint').and.returnValue(throwError(undefined));

      error = TestBed.inject(ErrorService);
      spyOn(error, 'handling')

      component.onLoadLists();

      expect(error.handling).toHaveBeenCalled();
    });
  });

  describe('#onAddUser', () => {
    describe('when tn is present in field', () => {
      beforeEach(() => {
        component.form.controls['tn'].setValue(tn_user);
      });
      let result = {
        result: "Добавлен доступ печати для: Иванов И.И."
      };

      it('should call method addUserPrint and assign obj', () => {
        requestsService = TestBed.inject(RequestsService);
        spyOn(requestsService, 'addUserPrint').and.returnValue(of(result));
        spyOn(requestsService, 'getUsersPrint').and.returnValue(of({users:[data]}));

        component.onAddUser();

        expect(component.lists[0]).toEqual(data);
      });

      it('should get error form server', () => {
        requestsService = TestBed.inject(RequestsService);
        spyOn(requestsService, 'addUserPrint').and.returnValue(throwError(undefined));

        error = TestBed.inject(ErrorService);
        spyOn(error, 'handling')

        component.onAddUser();

        expect(error.handling).toHaveBeenCalled();
      });
    });

    describe('when tn is blank in field', () => {
      beforeEach(() => {
        component.form.controls['tn'].setValue('      ');
      });

      it('should show notification', () => {
        notification = TestBed.inject(NotificationService);
        spyOn(notification , "show");

        component.onAddUser();

        expect(notification.show).toHaveBeenCalled();
      });
    });
  });

  describe('#onDestroyUser', () => {
    let id_record = 1;
    let fio = 'Иванов Иван Иванович';
    let result = { result: 'Убран доступ печати для: Иванов И.И.' };

    beforeEach(() => {
      confirmaDialog = TestBed.inject(ConfirmationDialogService);
      requestsService = TestBed.inject(RequestsService);

      fixture.detectChanges();
    });

    it('should deleted access for selected user', () => {
      spyOn(requestsService, 'deleteUserPrint').and.callThrough();
      requestsService.deleteUserPrint(id_record)
        .subscribe(response => {
          expect(response).toEqual(result);
        })

      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(true));

      component.onDestroyUser(id_record, fio);

      expect(requestsService.deleteUserPrint).toHaveBeenCalled();
    });

    it('should not deleted access for selected user', () => {
      spyOn(requestsService, 'deleteUserPrint')
      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(false));

      component.onDestroyUser(id_record, fio);

      expect(requestsService.deleteUserPrint).not.toHaveBeenCalled();
    });
  });
});
