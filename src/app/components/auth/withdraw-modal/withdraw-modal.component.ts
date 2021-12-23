import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';
import { ErrorService } from 'src/app/services/error.service';

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
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl(this.id_document, [Validators.required]),
      reason: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      flag_document: new FormControl(true),
      reason_document: new FormControl('', Validators.maxLength(255))
    })
  }

  onCheckChange() {
    if (this.form.value.flag_document) {
      this.form.controls['reason_document'].setValue('');
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
        this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
        this.activeModal.close()
      },
      (error) => {
        this.error.handling(error)
      })
  }

  closeModal() {
    this.activeModal.close();
  }

}
