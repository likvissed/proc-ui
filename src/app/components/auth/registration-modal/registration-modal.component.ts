import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationService } from 'src/app/services/notification.service';
import { RequestsService } from 'src/app/services/requests.service';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss']
})
export class RegistrationModalComponent implements OnInit {
  form: FormGroup;
  formData = new FormData();

  default_file_name = 'Файл не выбран'

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private requestsService: RequestsService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl('', [Validators.required]),

      deloved_id: new FormControl(null, [Validators.required]),
      file: new FormControl(null, [Validators.required]),
      file_name: new FormControl(this.default_file_name),

      state: '',
      date_start: '',
      date_end: '',
      fio: ''
    })
  }

  closeModal() {
    this.activeModal.close();
  }

  findDocument() {
    if (this.form.value.id) {

      this.requestsService.findDocument(this.form.value.id)
        .subscribe((response) => {
          this.form.setControl('id', new FormControl(this.form.value.id))

          this.form.setControl('state', new FormControl(response.state))
          this.form.setControl('date_start', new FormControl(response.date_start))
          this.form.setControl('date_end', new FormControl(response.date_end))
          this.form.setControl('fio', new FormControl(response.fio))
        },
        (error) => {
          this.changeId()

          console.error(error)
          let msg = error.error.error_description ? error.error.error_description : 'Сервер временно недоступен'
          this.notification.show(msg, { classname: 'bg-danger text-light', headertext: `Ошибка ${error.status}`});
        })
    }
  }

  changeId() {
    this.form.setControl('state', new FormControl(''))
    this.form.setControl('date_start', new FormControl(''))
    this.form.setControl('date_end', new FormControl(''))
    this.form.setControl('fio', new FormControl(''))
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files[0];

    if (!file) {
      this.form.setControl('file_name', new FormControl(this.default_file_name))
      this.notification.show('Загрузка файла не удалась. Попробуйте снова', { classname: 'bg-warning', headertext: 'Внимание'});

      return false;
    }

    this.form.setControl('file_name', new FormControl(file.name))

    this.formData.append(
      'file',
      file,
      file.name
    );
  }

  saveFile() {
    if (this.form.invalid) {
      return
    }

    this.formData.delete('id')
    this.formData.delete('deloved_id')

    this.formData.append('id', this.form.value.id);
    this.formData.append('deloved_id', this.form.value.deloved_id);

    this.requestsService.registrationDocument(this.formData)
      .subscribe((response) => {
        this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
        this.activeModal.close();
      },
      (error) => {
        console.error(error)

        let msg = error.error.error_description ? error.error.error_description : 'Сервер временно недоступен'
        this.notification.show(msg, { classname: 'bg-danger text-light', headertext: `Ошибка ${error.status}`});
      })
  }

}
