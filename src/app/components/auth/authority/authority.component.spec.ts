import { ErrorService } from './../../../services/error.service';
import { EditAuthorityComponent } from './../edit-authority/edit-authority.component';
import { FioForAuthorityPipe } from './../../../shared/fio-for-authority.pipe';
import { RequestsService } from './../../../services/requests.service';
import { ConfirmationDialogService } from './../../../services/confirmation-dialog.service';

import { AuthorityComponent } from './authority.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';

describe('AuthorityComponent', () => {
  let component: AuthorityComponent;
  let fixture: ComponentFixture<AuthorityComponent>;

  let requestsService: RequestsService;
  let confirmaDialog: ConfirmationDialogService;
  let modalService: NgbModal;
  let error: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuthorityComponent,
        FioForAuthorityPipe
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgbModule
      ],
      providers: [
        ConfirmationDialogService,
        RequestsService,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorityComponent);
    component = fixture.componentInstance;
  })

  let data = {
    lists: [
      {
        data: [
          {
            tn: 12345,
            fio: "Петров И.О.",
            fullname: "Петров Иван Олегович"
          }
        ],
        duty: 'получение-передача документов',
        id: 1,
        state: 5
      }
    ],
    recordsFiltered: 1,
    totalItems: 1
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAuthority and get response as array data', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getAuthority').and.returnValue(of(data));

    fixture.detectChanges();

    expect(component.lists.length).toEqual(data.lists.length)
  });

  it('should call loadAuthority and get response as empty array ', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getAuthority').and.returnValue(throwError(undefined));

    fixture.detectChanges();

    expect(component.lists).toEqual([])
  });

  it('should get error form server', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getAuthority').and.returnValue(throwError(undefined));

    error = TestBed.inject(ErrorService);
    spyOn(error, 'handling')

    component.loadAuthority();

    expect(error.handling).toHaveBeenCalled();
  });

  it('should open modal window', async () => {
    modalService = TestBed.inject(NgbModal);

    spyOn(modalService, 'open').and.callFake((dlg, opt) => {
      return <NgbModalRef>({ componentInstance: new EditAuthorityComponent(null, null, null, null, null) })
    });

    await modalService.open({ size: 'lg', backdrop: 'static'  });

    expect(modalService.open).toHaveBeenCalled();
  });

  describe('#deleteAuthority', function () {
    let id = 123;
    let data = { result: 'Полномочие удалено' };

    beforeEach(() => {
      confirmaDialog = TestBed.inject(ConfirmationDialogService);
      requestsService = TestBed.inject(RequestsService);

      fixture.detectChanges();
    });

    it('should deleted authority', () => {
      spyOn(requestsService, 'deleteAuthority').and.callThrough();

      requestsService.deleteAuthority(id)
        .subscribe(response => {
          expect(response).toEqual(data);
        })

      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(true));

      component.deleteAuthority(id, 'name');

      expect(requestsService.deleteAuthority).toHaveBeenCalled();
    });

    it('should not deleted authority', () => {
      spyOn(requestsService, 'deleteAuthority')
      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(false));

      component.deleteAuthority(id, 'name');

      expect(requestsService.deleteAuthority).not.toHaveBeenCalled();
    });
  });
})
