import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';

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
    private notification: NotificationService
  ) { }

  lists

  ngOnInit(): void {
    this.requestsService.getChancellery().subscribe((response) => {
      this.lists = response.list
    },
    (error) => {
      this.lists = []
      console.error(error)
      this.notification.show('Сервер временно недоступен', { classname: 'bg-danger text-light', headertext: `Ошибка ${error.status}`});
    })
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
        console.error(error)
        this.notification.show('Сервер временно недоступен', { classname: 'bg-danger text-light', headertext: `Ошибка ${error.status}`});
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
