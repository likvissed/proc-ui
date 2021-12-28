import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthHelper } from '@iss/ng-auth-center';

import { RequestsService } from '../../../services/requests.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private authHelper: AuthHelper,
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  lists

  statuses = [
    { disabled: 1, value: '', name: 'Выберите статус' },
    { disabled: 0, value: '', name: 'Все статусы' },
    { disabled: 0, value: 0, name: 'Новая' },
    { disabled: 0, value: 1, name: 'Действующая' },
    { disabled: 0, value: 2, name: 'Просроченная' },
    { disabled: 0, value: 3, name: 'Отклонённая' },
    { disabled: 0, value: 4, name: 'Отозванная' },
    { disabled: 0, value: 5, name: 'Согласованная' }
  ]

  filters = {
    id: '',
    status: this.statuses[0].value,
    fio: ''
  }

  pagination = {
    currentPage: 1,
    totalItems: 0,
    recordsFiltered:0,
    maxSize: 20,
    startRecord: 1,
    endRecord: 20,
    totalPages: 1
  };

  ngOnInit(): void {
    this.loadList()
  }

  loadList() {
    // отправляется таб.номер пользователя
    this.requestsService.getList(
        this.authHelper.getJwtPayload()['tn'],
        this.filters,
        this.pagination.currentPage,
        this.pagination.maxSize
      ).subscribe((response) => {
      this.lists = response.lists
      this.pagination.totalItems = response.totalItems
      this.pagination.recordsFiltered = response.recordsFiltered

      this.calculatePagination()
    },
    (error) => {
      this.lists = []

      this.error.handling(error)
    })
  }

  filterChange() {
    this.pagination.currentPage = 1

    this.loadList()
  }

  pageChanged(event){
    this.loadList();
  }

  calculatePagination() {
    this.pagination.startRecord = (this.pagination.currentPage - 1) * this.pagination.maxSize + 1
    this.pagination.endRecord = this.pagination.startRecord + this.pagination.maxSize - 1
    this.pagination.totalPages = Math.ceil(this.pagination.recordsFiltered / this.pagination.maxSize)

    if (this.pagination.endRecord != this.pagination.recordsFiltered && this.pagination.totalPages == this.pagination.currentPage) {
      this.pagination.endRecord = this.pagination.recordsFiltered
    }
  }

  // Создать на основе сформированной доверенности
  createOnBase(id: number):void {
    this.router.navigateByUrl(`/new/${id}`);
  }

  // Скачать документ
  downloadDoc(id: number, status: number):any {
    this.requestsService.downloadFile(id)
      .subscribe((response: Blob) => {
        let file = new Blob([response], { type: response.type });
        let fileURL = URL.createObjectURL(file);

        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        let nameFile = status == 1 ? 'Скан' : 'Доверенность'
        fileLink.download = `${nameFile}_${id}`;

        fileLink.click();
      },
      (error) => {
        this.error.handling(error)
      })
  }

  // Удалить доверенность
  deleteDoc(id: number): void {
    if(confirm(`Вы действительно хотите удалить "Доверенность_${id}.pdf"?`)) {
      this.requestsService.deleteDocument(id)
      .subscribe((response) => {
        this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});

        this.ngOnInit()
      },
      (error) => {
        this.error.handling(error)
      })
    }
  }
}
