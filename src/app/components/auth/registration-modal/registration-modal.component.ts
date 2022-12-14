import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ErrorService } from './../../../services/error.service';
import { NotificationService } from './../../../services/notification.service';
import { RequestsService } from './../../../services/requests.service';

@Component({
  selector: 'app-registration-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: ['./registration-modal.component.scss']
})
export class RegistrationModalComponent implements OnInit {
  form: FormGroup;
  formData = new FormData();
  @Input() public data;

  default_file_name = 'Файл не выбран'

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private requestsService: RequestsService,
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      id: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),

      deloved_id: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9 -]*$")]),
      file: new FormControl(null, [Validators.required]),
      file_name: new FormControl(this.default_file_name),

      state: '',
      date_start: '',
      date_end: '',
      fio: ''
    })

    if (this.data) {
      this.form.patchValue(this.data);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  findDocument() {
    if (this.form.value.id) {

      this.requestsService.findDocument(this.form.value.id)
        .subscribe((response) => {
          this.form.controls['id'].setValue(this.form.value.id);

          this.form.setControl('state', new FormControl(response.state))
          this.form.setControl('date_start', new FormControl(response.date_start))
          this.form.setControl('date_end', new FormControl(response.date_end))
          this.form.setControl('fio', new FormControl(response.fio))
        },
        (error) => {
          this.changeId()

          this.error.handling(error)
        })
    }
  }

  changeId() {
    this.form.controls['state'].setValue('')
    this.form.controls['date_start'].setValue('')
    this.form.controls['date_end'].setValue('')
    this.form.controls['fio'].setValue('')
  }

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let file: File | null = element.files[0];

    if (!file) {
      this.form.controls['file_name'].setValue(this.default_file_name)
      this.notification.show('Загрузка файла не удалась. Попробуйте снова', { classname: 'bg-warning', headertext: 'Внимание'});

      return false;
    }

    // Перевести размер загруженного файла из байт в Мб
    let file_size = file.size / 1024 / 1024;
    if (file_size > 20) {
      this.notification.show('Невозможно загрузить файл, размером больше 20 мегабайт', { classname: 'bg-danger text-light', headertext: 'Внимание'});
      this.form.controls['file'].setValue(null)

      return false;
    }

    this.form.controls['file_name'].setValue(file.name)

    this.formData.append(
      'file',
      file,
      file.name
    );
  }

  writeLog() {
    console.log(this.form)
  }

  saveFile() {
    this.formData.delete('id')
    this.formData.delete('deloved_id')

    this.formData.append('id', this.form.value.id);
    this.formData.append('deloved_id', this.form.value.deloved_id);

    if (!this.data) {
      this.requestsService.registrationDocument(this.formData)
        .subscribe((response) => {
          this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
          this.activeModal.close();
        },
        (error) => {
          this.error.handling(error)
        })
    } else {
      this.requestsService.updateDocument(this.formData, this.form.value.id)
        .subscribe((response) => {
          this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
          this.activeModal.close();
        },
        (error) => {
          this.error.handling(error)
        })
    }
  }

}
