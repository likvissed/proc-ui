import { Request } from './../../../interfaces';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from 'src/app/services/requests.service';
import { DoneModalComponent } from '../done-modal/done-modal.component';

@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit {
  @Input() public request;
  @Input() public templateFile;

  constructor(
    public activeModal: NgbActiveModal,
    private requestsService: RequestsService,
    private modalService: NgbModal
  ) {}

  submitted = false

  ngOnInit(): void {
    let newBlob = new Blob([this.templateFile], { type: "application/pdf" });
    let datalocalURL = window.URL.createObjectURL(newBlob);
    document.querySelector("iframe").src = datalocalURL;
  }

  closeModal() {
    this.activeModal.close();
  }

  sendToSsd() {
    this.submitted = true

    this.requestsService.sendForApproval(this.request)
      .subscribe((response) => {
        console.log('response yes', response)
        this.submitted = false
        this.activeModal.close()

        this.modalService.open(DoneModalComponent, { size: 'lg' })
      },
      (error) => {
        console.error('error no', error)
        this.submitted = false
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })


  }

}
