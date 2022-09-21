import { MomentDateFormatter } from './../shared/dateFormat';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { FormBuilder } from '@angular/forms';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from "./requests.service";
import { DateAdapter } from '../shared/dateAdapter';

describe('RequestsService', () => {
  let service: RequestsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RequestsService,
        FormBuilder,
        { provide: AuthHelper, useClass: AuthHelperStub },
        { provide: NgbDateParserFormatter, useValue: new MomentDateFormatter },
        { provide: NgbDateAdapter, useValue: new DateAdapter },
      ]
    });

    service = TestBed.inject(RequestsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  // проверка, что не осталось зависших http запросов
  afterEach(() => httpTestingController.verify())

  let apiUrl = 'https://vm713.***REMOVED***:24026'
  let user_tn = 12345;

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  describe('#getDuties', () => {
    const dutiesUrl = `${apiUrl}/duties_list`
    const data = {
      duties: [
        'получение-передача документов',
        'выполнять все необходимые действия',
        'прочее полномочие'
      ]
    }

    it('should return data', () => {
      service.getDuties(user_tn)
        .subscribe(response => {
          expect(response).toEqual(data);
        })

      const req = httpTestingController.expectOne({method: 'GET', url: `${dutiesUrl}?tn=${user_tn}`});

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.getDuties(user_tn)
        .subscribe(response => {
          expect(response.duties.length).toEqual(3);
          expect(response).toBe(data);
        })

        const req = httpTestingController.expectOne({method: 'GET', url: `${dutiesUrl}?tn=${user_tn}`});

        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('json');
        expect(req.request.url).toEqual(dutiesUrl);

        req.flush(data);
    });
  });

  describe('#templateFile', () => {
    const templateUrl = `${apiUrl}/sample`
    let data = new Blob();
    let request: any;

    beforeEach(() => {
      request = {
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
    })

    it('should return file', () => {
      service.templateFile(request)
        .subscribe(response => {
          expect(response).toEqual(data);
        })

      const req = httpTestingController.expectOne({method: 'POST', url: `${templateUrl}`});

      req.flush(data);
    });
  });

  describe('#sendForApproval', () => {
    const approvalUrl = `${apiUrl}/ssd_send`
    let data = new Blob();
    let request: any;

    beforeEach(() => {
      request = {
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
    })

    it('should return text', () => {
      service.sendForApproval(request)
        .subscribe(response => {
          expect(response).toEqual(data);
        })

      const req = httpTestingController.expectOne({method: 'POST', url: `${approvalUrl}`});

      req.flush(data);
    });
  });

  describe('#getList', () => {
    const listUrl = `${apiUrl}/proxies_list`
    const data = {
      lists: [
        {
          author_fio: "Иванова Елена Константиновна",
          date: "2021-12-09 16:18:00",
          fio: "Петров Иван Олегович",
          id: 1,
          sign_comment: "Подписано автоматически на этапе согласования с о.775",
          state: 4
        }
      ],
      recordsFiltered: 4,
      totalItems: 4
    }

    it('should return data', () => {
      service.getList(user_tn, 1, 1, 1)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${listUrl}?author_tn=${user_tn}&filters=1&page=1&size=1`);

      req.flush(data);
    });
  });

  describe('#checkAccessUserPrint', () => {
    const checkUrl = `${apiUrl}/print_access`
    const data = {
      result: true
    }

    it('should return data', () => {
      service.checkAccessUserPrint(user_tn)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${checkUrl}?tn=${user_tn}`);

      expect(req.request.method).toEqual('GET');

      req.flush(data);
    });
  });

  describe('#getJsonDoc', () => {
    const jsonDocUrl = `${apiUrl}/docx_info`
    let id_doc = 1;
    let data: any;

    beforeEach(() => {
      data = {
        tn: '12345',
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
      }
    })

    it('should return data', () => {
      service.getJsonDoc(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${jsonDocUrl}?id=${id_doc}`);

      req.flush(data);
    });
  });

  describe('#downloadFile', () => {
    const downloadUrl = `${apiUrl}/file_download`
    let id_doc = 1;
    let data = new Blob();

    it('should return file', () => {
      service.downloadFile(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(downloadUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.downloadFile(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(downloadUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('blob');
      expect(req.request.url).toEqual(downloadUrl);

      req.flush(data);
    });
  });

  describe('#deleteDocument', () => {
    const deleteUrl = `${apiUrl}/delete_proxy`
    let id_doc = 1;
    let data = { result: 'Доверенность удалена' };

    it('should return data', () => {
      service.deleteDocument(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deleteUrl}/${id_doc}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.deleteDocument(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deleteUrl}/${id_doc}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${deleteUrl}/${id_doc}`);

      req.flush(data);
    });
  });

  describe('#getChancellery', () => {
    const chancelleryUrl = `${apiUrl}/agreed_proxies`
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
    const filters = {
      id: '',
      status: '',
      fio: '',
      deloved_id: ''
    }
    const page = 1
    const size = 1

    const httpParams = new HttpParams()
      .append('filters', `${JSON.stringify(filters)}`)
      .append('page', `${page}`)
      .append('size', `${size}`);

    it('should return data', () => {
      service.getChancellery(filters, page, size)
        .subscribe(response => {
          expect(response).toBe(data);
        })

      const req = httpTestingController.expectOne({method: 'GET', url: `${chancelleryUrl}?${httpParams}`});

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.getChancellery(filters, page, size)
        .subscribe(response => {
          expect(response.lists.length).toEqual(1);
          expect(response).toBe(data);
        })

        const req = httpTestingController.expectOne({method: 'GET', url: `${chancelleryUrl}?${httpParams}`});

        expect(req.request.method).toEqual('GET');
        expect(req.request.responseType).toEqual('json');
        expect(req.request.url).toEqual(chancelleryUrl);

        req.flush(data);
    });
  });

  describe('#withdrawDocument', () => {
    const withdrawUrl = `${apiUrl}/proxy_revoke`
    let id_doc = 1;
    let data = { result: `Доверенность №${id_doc} отозвана` };
    let form_withdraw: any;

    beforeEach(() => {
      form_withdraw = {
        flag_document: true,
        id: id_doc,
        reason: "причина",
        reason_document: ""
      }
    })

    it('should return data', () => {
      service.withdrawDocument(form_withdraw)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(withdrawUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.withdrawDocument(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(withdrawUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(withdrawUrl);

      req.flush(data);
    });
  });

  describe('#findDocument', () => {
    const findDocUrl = `${apiUrl}/proxy_search`
    let id_doc = 1;
    let data = {
      author_fio: 'Иванов Иван Николаевич',
      date_end: '29.12.2021',
      date_start: '30.11.2021',
      fio: 'Иванов Иван Николаевич',
      state: 5
    }

    it('should return data', () => {
      service.findDocument(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${findDocUrl}?id=${id_doc}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.findDocument(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${findDocUrl}?id=${id_doc}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${findDocUrl}?id=${id_doc}`);

      req.flush(data);
    });
  });

  describe('#registrationDocument', () => {
    const registrationUrl = `${apiUrl}/add_deloved_id`
    let data = { result: 'Документ успешно зарегистрирован' }
    let form_data = {}

    it('should return data', () => {
      service.registrationDocument(form_data)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(registrationUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.registrationDocument(form_data)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(registrationUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(registrationUrl);

      req.flush(data);
    });
  });

  describe('#updateDocument', () => {
    const updateUrl = `${apiUrl}/proxy_edit`
    let data = { result: 'Доверенность изменена' }
    let id = 123;
    let form_data = {}

    it('should return data', () => {
      service.updateDocument(form_data, id)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${updateUrl}/${id}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.updateDocument(form_data, id)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${updateUrl}/${id}`);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${updateUrl}/${id}`);

      req.flush(data);
    });
  });

  describe('#getUsersPrint', () => {
    const getPrintUrl = `${apiUrl}/print_list`
    let data = {
      id: 1,
      fio: "Иванов Иван Иванович",
      dept: "714",
      phone: "11-11",
      tn: user_tn,
    }

    it('should return data', () => {
      service.getUsersPrint()
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(getPrintUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.getUsersPrint()
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(getPrintUrl);

      expect(req.request.method).toEqual('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(getPrintUrl);

      req.flush(data);
    });
  });

  describe('#addUserPrint', () => {
    const addPrintUrl = `${apiUrl}/print_add`
    let data = { result: 'Добавлен доступ печати для: Иванов И.И.' }

    it('should return data', () => {
      service.addUserPrint(user_tn)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${addPrintUrl}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.addUserPrint(user_tn)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${addPrintUrl}`);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(addPrintUrl);

      req.flush(data);
    });
  });

  describe('#deleteUserPrint', () => {
    const deletePrintUrl = `${apiUrl}/print_delete`
    let id_user = 1;
    let data = { result: 'Убран доступ печати для: Иванов И.И.' }

    it('should return data', () => {
      service.deleteUserPrint(id_user)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deletePrintUrl}/${id_user}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.deleteUserPrint(id_user)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deletePrintUrl}/${id_user}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${deletePrintUrl}/${id_user}`);

      req.flush(data);
    });
  });

  describe('#registrationExternalDoc', () => {
    const registrationExternalUrl = `${apiUrl}/foreign_deloved_id`
    let data = { result: 'Документ зарегистрирован' }
    let form_data = {}

    it('should return data', () => {
      service.registrationExternalDoc(form_data)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(registrationExternalUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.registrationExternalDoc(form_data)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(registrationExternalUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(registrationExternalUrl);

      req.flush(data);
    });
  });

  describe('#getAuthority', () => {
    const allAuthorityUrl = `${apiUrl}/all_duties`
    let id_doc = 1;
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
          id: id_doc,
          state: 5
        }
      ],
      recordsFiltered: 1,
      totalItems: 1
    }
    const filters = {
      fio: '',
      status: '',
      duty: ''
    }
    const page = 1
    const size = 1

    const httpParams = new HttpParams()
      .append('filters', `${JSON.stringify(filters)}`)
      .append('page', `${page}`)
      .append('size', `${size}`);

    it('should return data', () => {
      service.getAuthority(filters, page, size)
        .subscribe(response => {
          expect(response).toBe(data);
        })

      const req = httpTestingController.expectOne({method: 'GET', url: `${allAuthorityUrl}?${httpParams}`});

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.getAuthority(filters, page, size)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne({method: 'GET', url: `${allAuthorityUrl}?${httpParams}`});

      expect(req.request.method).toEqual('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(allAuthorityUrl);

      req.flush(data);
    });
  });

  describe('#deleteAuthority', () => {
    const deleteUrl = `${apiUrl}/remove_duty`
    let id_doc = 1;
    let data = { result: 'Полномочие удалено' };

    it('should return data', () => {
      service.deleteAuthority(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deleteUrl}/${id_doc}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.deleteAuthority(id_doc)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${deleteUrl}/${id_doc}`);

      expect(req.request.method).toEqual('DELETE');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${deleteUrl}/${id_doc}`);

      req.flush(data);
    });
  });

  describe('#addAuthority', () => {
    const addAuthorityUrl = `${apiUrl}/add_duty`
    let form = {
      access: true,
      id: null,
      name: 'новое полномочие'
    }
    let data = { result: 'Полномочие добавлено' };

    it('should return data', () => {
      service.addAuthority(form)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(addAuthorityUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.addAuthority(form)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(addAuthorityUrl);

      expect(req.request.method).toEqual('POST');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(addAuthorityUrl);

      req.flush(data);
    });
  });

  describe('#updateAuthority', () => {
    const updateAuthorityUrl = `${apiUrl}/edit_duty`
    let form = {
      access: true,
      id: 1,
      name: 'полномочие'
    }
    let data = { result: 'Полномочие изменено' };

    it('should return data', () => {
      service.updateAuthority(form)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(updateAuthorityUrl);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.updateAuthority(form)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(updateAuthorityUrl);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(updateAuthorityUrl);

      req.flush(data);
    });
  });

  describe('#findUserByTn', () => {
    const findUserByTnUrl = `${apiUrl}/tn_search`
    let data = {
      fio: "Иванов Иван Иванович",
      login: "IvanovII",
      tn: user_tn
    };

    it('should return data', () => {
      service.findUserByTn(user_tn)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${findUserByTnUrl}?tn=${user_tn}`);

      req.flush(data);
    });

    it('should call http with the expected url and params', () => {
      service.findUserByTn(user_tn)
        .subscribe(resp => {
          expect(resp).toEqual(data);
        })

      const req = httpTestingController.expectOne(`${findUserByTnUrl}?tn=${user_tn}`);

      expect(req.request.method).toEqual('GET');
      expect(req.request.responseType).toEqual('json');
      expect(req.request.url).toEqual(`${findUserByTnUrl}?tn=${user_tn}`);

      req.flush(data);
    });
  });

});
