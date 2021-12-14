import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
    private modalService: NgbModal
  ) { }

  lists

  ngOnInit(): void {
    this.requestsService.getChancellery().subscribe((response) => {
      this.lists = response.list
    },
    (error) => {
      this.lists = []
      console.error('error', error)
      alert(`Ошибка ${error.status}. Сервер временно недоступен`)
    })
  }

  download(id: number):any {
    this.requestsService.downloadFile(id)
      .subscribe((response: Blob) => {
        console.log('file blob', response)
        let file = new Blob([response], { type: response.type });
        let fileURL = URL.createObjectURL(file);

        // create <a> tag dinamically
        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        // it forces the name of the downloaded file
        fileLink.download = `Скан-${id}`;

        // triggers the click event
        fileLink.click();
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
  }

  withdraw(id: number):any {
    const modalRef = this.modalService.open(WithdrawModalComponent, { size: 'lg' })
    modalRef.componentInstance.id_document = id

    modalRef.result.then((result) => {
      this.ngOnInit()
    }).catch((error) => {
    });
  }

  registrationDoc() {
    const modalRefReg = this.modalService.open(RegistrationModalComponent, { size: 'lg' })

    modalRefReg.result.then((result) => {
      this.ngOnInit()
    }).catch((error) => {
    });
  }

}
