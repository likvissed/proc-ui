import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-withdraw-modal',
  templateUrl: './withdraw-modal.component.html',
  styleUrls: ['./withdraw-modal.component.scss']
})
export class WithdrawModalComponent implements OnInit {
  form: FormGroup;
  @Input() public id_document;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private requestsService: RequestsService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl(this.id_document, [Validators.required]),
      reason: new FormControl(null, [Validators.required]),
      flag_document: new FormControl(true),
      reason_document: new FormControl('')
    })
  }

  onCheckChange() {
    if (this.form.value.flag_document) {
      this.form.setControl('reason_document', new FormControl(''))
    }
  }

  send() {
    if (this.form.invalid) {
      return
    }

    if (!this.form.value.flag_document && !this.form.value.reason_document.trim()) {
      this.notification.show('Укажите причину отсутствия подлинника', { classname: 'bg-warning', headertext: 'Внимание'});

      return
    }

    this.requestsService.withdrawDocument(this.form.getRawValue())
      .subscribe((response) => {
        this.notification.show('Доверенность отозвана', { classname: 'bg-success text-light', headertext: 'Успешно'});
        this.activeModal.close()
      },
      (error) => {
        console.error(error)
        let msg = error.error.error_description ? error.error.error_description : 'Сервер временно недоступен'
        this.notification.show(msg, { classname: 'bg-danger text-light', headertext: `Ошибка ${error.status}`});
      })
  }

  closeModal() {
    this.activeModal.close();
  }

}
