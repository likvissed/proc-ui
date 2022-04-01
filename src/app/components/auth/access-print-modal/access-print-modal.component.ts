import { ConfirmationDialogService } from './../../../services/confirmation-dialog.service';
import { ErrorService } from './../../../services/error.service';
import { RequestsService } from './../../../services/requests.service';
import { NotificationService } from './../../../services/notification.service';

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-access-print-modal',
  templateUrl: './access-print-modal.component.html',
  styleUrls: ['./access-print-modal.component.scss']
})
export class AccessPrintModalComponent implements OnInit {
  form: FormGroup;
  lists = []

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private notification: NotificationService,
    private requestsService: RequestsService,
    private error: ErrorService,
    private confirmaDialog: ConfirmationDialogService
  ) { }

  submitted = false

  ngOnInit(): void {
    this.onInitial();
  }

  onInitial() {
    this.form = this.formBuilder.group({
      tn: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
    })

    this.onLoadLists();
  }

  onLoadLists() {
    this.lists = [];

    this.requestsService.getUsersPrint()
      .subscribe((response) => {
        response.users.forEach(value => {
          this.lists.push(value);
        });
      },
      (error) => {
        this.error.handling(error);
      })
  }

  onAddUser() {
    if (this.form.value.tn.toString().trim()) {
      this.submitted = true

      this.requestsService.addUserPrint(this.form.value.tn)
        .subscribe((response) => {
          this.submitted = false
          this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});

          this.onLoadLists();
        },
        (error) => {
          this.error.handling(error)
        })
    } else {
      this.submitted = false

      this.notification.show('Табельный номер не введен', { classname: 'bg-warning', headertext: 'Внимание'});
    }
  }

  onDestroyUser(id, fio) {
    this.confirmaDialog.confirm(`Вы действительно хотите удалить доступ у пользователя: <br> <b>${fio}</b>?`)
      .then((confirmed) => {
        if (confirmed) {
          this.requestsService.deleteUserPrint(id)
            .subscribe((response) => {
              this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
              this.ngOnInit();
            },
            (error) => {
              this.error.handling(error)
            })
        }
      })
  }

}
