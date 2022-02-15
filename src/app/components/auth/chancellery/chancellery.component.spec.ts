import { ErrorService } from './../../../services/error.service';
import { ShortNamePipe } from './../../../shared/shortName.pipe';
import { NameForStatusPipe } from './../../../shared/nameForStatus.pipe';
import { RequestsService } from './../../../services/requests.service';

import { RegistrationModalComponent } from './../registration-modal/registration-modal.component';
import { WithdrawModalComponent } from './../withdraw-modal/withdraw-modal.component';
import { ChancelleryComponent } from './chancellery.component';

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';

describe('ChancelleryComponent', () => {
  let component: ChancelleryComponent;
  let fixture: ComponentFixture<ChancelleryComponent>;

  let requestsService: RequestsService;
  let modalService: NgbModal;
  let error: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ChancelleryComponent,
        NameForStatusPipe,
        ShortNamePipe
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        NgbModule
      ],
      providers: [
        RequestsService,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChancelleryComponent);
    component = fixture.componentInstance;
  })

  const data = {
    lists: [
      {
        author_fio: "Иванов Иван Николаевна",
        date_end: "29.11.2023",
        date_start: "29.11.2021",
        fio: "Петров Илья Иванович",
        deloved_id: "28",
        exists: 1,
        id: 5,
        state: 1
      }
    ],
    recordsFiltered: 1,
    totalItems: 1
  }

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the list chancellery', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getChancellery').and.returnValue(of(data));
    fixture.detectChanges();

    component.ngOnInit();
    expect(requestsService.getChancellery).toHaveBeenCalled();
  });

  it('should call loadChancellery and get response as array data', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getChancellery').and.returnValue(of(data));
    fixture.detectChanges();

    expect(component.lists.length).toEqual(data.lists.length)
  });

  it('should call loadChancellery and get response as empty data', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getChancellery').and.returnValue(throwError(undefined));
    fixture.detectChanges();

    expect(component.lists).toEqual([])
  });

  it('should get error form server', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'getChancellery').and.returnValue(throwError(undefined));

    error = TestBed.inject(ErrorService);
    spyOn(error, 'handling')

    component.loadChancellery();

    expect(error.handling).toHaveBeenCalled();
  });

  it('shoule call method download', () => {
    requestsService = TestBed.inject(RequestsService);
    spyOn(requestsService, 'downloadFile').and.callThrough();

    component.download(123);

    expect(requestsService.downloadFile).toHaveBeenCalled();
  });

  it('should open modal window Withdraw', async () => {
    modalService = TestBed.inject(NgbModal);

    spyOn(modalService, 'open').and.callFake((dlg, opt) => {
      return <NgbModalRef>({ componentInstance: new WithdrawModalComponent(null, null, null, null, null) })
    });

    await modalService.open({ size: 'lg', backdrop: 'static'  });

    expect(modalService.open).toHaveBeenCalled();
  });

  it('should open modal window Registratio', async () => {
    modalService = TestBed.inject(NgbModal);

    spyOn(modalService, 'open').and.callFake((dlg, opt) => {
      return <NgbModalRef>({ componentInstance: new RegistrationModalComponent(null, null, null, null, null) })
    });

    await modalService.open({ size: 'lg', backdrop: 'static'  });

    expect(modalService.open).toHaveBeenCalled();
  });
});
