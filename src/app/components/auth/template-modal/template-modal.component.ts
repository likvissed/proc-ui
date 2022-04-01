import { NotificationService } from './../../../services/notification.service';
import { Component, Input, OnInit } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';

import { DoneModalComponent } from '../done-modal/done-modal.component';

@Component({
  selector: 'app-template-modal',
  templateUrl: './template-modal.component.html',
  styleUrls: ['./template-modal.component.scss']
})
export class TemplateModalComponent implements OnInit {
  @Input() public request;
  @Input() public templateFile;
  @Input() public button_print;

  constructor(
    public activeModal: NgbActiveModal,
    private requestsService: RequestsService,
    private modalService: NgbModal,
    private error: ErrorService,
    private notification: NotificationService
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
        this.submitted = false
        this.activeModal.close()

        this.modalService.open(DoneModalComponent, { size: 'lg' })
      },
      (error) => {
        this.submitted = false

        this.error.handling(error)
      })
  }

  printDoc() {
    this.submitted = true

    this.requestsService.sendForApproval(this.request)
      .subscribe((response: Blob) => {
        this.submitted = false
        this.activeModal.close();

        let file = new Blob([response], { type: response.type });
        let fileURL = URL.createObjectURL(file);

        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        let nameFile = 'Доверенность'
        fileLink.download = `${nameFile}`;

        fileLink.click();

        this.notification.show('Доверенность загружена', { classname: 'bg-success text-light', headertext: 'Успешно'});
      },
      (error) => {
        this.submitted = false

        this.error.handling(error)
      })
  }

}
