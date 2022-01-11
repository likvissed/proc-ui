import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';
import { ErrorService } from 'src/app/services/error.service';

import { RegistrationModalComponent } from '../registration-modal/registration-modal.component';
import { WithdrawModalComponent } from '../withdraw-modal/withdraw-modal.component';

@Component({
  selector: 'app-chancellery',
  templateUrl: './chancellery.component.html',
  styleUrls: ['./chancellery.component.scss']
})
export class ChancelleryComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private modalService: NgbModal,
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  lists

  statuses = [
    { disabled: 1, value: '', name: 'Выберите статус' },
    { disabled: 0, value: '', name: 'Все статусы' },
    { disabled: 0, value: 1, name: 'Действующая' },
    { disabled: 0, value: 5, name: 'Согласованная' }
  ]

  filters = {
    id: '',
    status: this.statuses[0].value,
    fio: '',
    deloved_id: ''
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
    this.loadChancellery()
  }

  loadChancellery() {
    this.requestsService.getChancellery(this.filters, this.pagination.currentPage, this.pagination.maxSize).subscribe((response) => {
      if (!response.lists) {
        this.error.handling(response)
        return
      }

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

    this.loadChancellery()
  }

  pageChanged(event){
    this.loadChancellery();
  }


  calculatePagination() {
    this.pagination.startRecord = (this.pagination.currentPage - 1) * this.pagination.maxSize + 1
    this.pagination.endRecord = this.pagination.startRecord + this.pagination.maxSize - 1
    this.pagination.totalPages = Math.ceil(this.pagination.recordsFiltered / this.pagination.maxSize)

    if (this.pagination.endRecord != this.pagination.recordsFiltered && this.pagination.totalPages == this.pagination.currentPage) {
      this.pagination.endRecord = this.pagination.recordsFiltered
    }
  }

  download(id: number):any {
    this.requestsService.downloadFile(id)
      .subscribe((response: Blob) => {
        let file = new Blob([response], { type: response.type });
        let fileURL = URL.createObjectURL(file);

        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        fileLink.download = `Скан-${id}`;

        fileLink.click();
      },
      (error) => {
        this.error.handling(error)
      })
  }

  withdraw(id: number):any {
    const modalRef = this.modalService.open(WithdrawModalComponent, { size: 'lg', backdrop: 'static' })
    modalRef.componentInstance.id_document = id

    modalRef.result.then((result) => {
      this.ngOnInit()
    }).catch((error) => {
    });
  }

  registrationDoc() {
    const modalRefReg = this.modalService.open(RegistrationModalComponent, { size: 'lg', backdrop: 'static' })

    modalRefReg.result.then((result) => {
      this.ngOnInit()
    }).catch((error) => {
    });
  }

}
