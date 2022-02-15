import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ListComponent } from './list.component';
import { RequestsService } from './../../../services/requests.service';
import { ConfirmationDialogService } from './../../../services/confirmation-dialog.service';
import { NameForStatusPipe } from './../../../shared/nameForStatus.pipe';
import { ShortNamePipe } from './../../../shared/shortName.pipe';

import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { of, throwError } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

let jwt_for_user = {
  access_to_chancellery: true,
  access_to_duties: true,
  fio: "Иванов Иван Иванович",
  fio_initials: "Иванов И.И.",
  id_tn: "98731",
  login: "IvanovII",
  tel: "10-01",
  tn: "10001"
}

describe('ChancelleryComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  let requestsService: RequestsService;
  let authHelper: AuthHelper;
  let confirmaDialog: ConfirmationDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ListComponent,
        ShortNamePipe,
        NameForStatusPipe
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        NgbModule
      ],
      providers: [
        RequestsService,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    authHelper = TestBed.inject(AuthHelper);
    spyOn(authHelper, 'getJwtPayload').and.returnValue(jwt_for_user)
  })

  const id_doc = 123;
  const data = {
    lists: [
      {
        author_fio: "Иванова Елена Константиновна",
        date: "2021-12-09 16:18:00",
        fio: "Петров Иван Олегович",
        id: id_doc,
        sign_comment: "Подписано автоматически на этапе согласования с о.775",
        state: 4
      }
    ],
    recordsFiltered: 4,
    totalItems: 4
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should call method getJwtPayload for authHelper service', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getList').and.returnValue(of(data));
    fixture.detectChanges();

    component.ngOnInit();
    expect(authHelper.getJwtPayload).toHaveBeenCalled();
  });

  it('should load the list documents', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getList').and.returnValue(of(data));
    fixture.detectChanges();

    component.ngOnInit();
    expect(requestsService.getList).toHaveBeenCalled();
  });

  it('should call loadList method and get response as array data', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getList').and.returnValue(of(data));
    fixture.detectChanges();

    expect(component.lists.length).toEqual(data.lists.length)
  });

  it('should returun response is empty', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getList').and.returnValue(throwError(undefined));
    fixture.detectChanges();

    expect(component.lists).toEqual([])
  });

  it('should call Router.navigateByUrl with id', inject([Router], (router: Router) => {
    const onBaseUrl = `/new/${id_doc}`;
    const spy = spyOn(router, 'navigateByUrl');

    component.createOnBase(id_doc);

    const url = spy.calls.first().args[0];

    expect(url).toBe(onBaseUrl);
  }));

  it('shoule call method downloadDoc', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'downloadFile').and.callThrough();

    component.downloadDoc(id_doc, 0);
    expect(requestsService.downloadFile).toHaveBeenCalled();
  });

  describe('#deleteDoc', function () {
    let data = { result: 'Доверенность удалена' };

    beforeEach(() => {
      confirmaDialog = TestBed.inject(ConfirmationDialogService);
      requestsService = TestBed.inject(RequestsService);

      fixture.detectChanges();
    });

    it('should deleted document', () => {
      spyOn(requestsService, 'deleteDocument').and.callThrough();
      requestsService.deleteDocument(id_doc)
        .subscribe(response => {
          expect(response).toEqual(data);
        })

      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(true));

      component.deleteDoc(id_doc);

      expect(requestsService.deleteDocument).toHaveBeenCalled();
    });

    it('should not deleted document', () => {
      spyOn(requestsService, 'deleteDocument')
      spyOn(confirmaDialog, 'confirm').and.returnValue(Promise.resolve(false));

      component.deleteDoc(id_doc);

      expect(requestsService.deleteDocument).not.toHaveBeenCalled();
    });
  });

});
