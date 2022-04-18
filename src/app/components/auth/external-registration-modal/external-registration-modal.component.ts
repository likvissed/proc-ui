import { MomentDateFormatter } from './../../../shared/dateFormat';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { ErrorService } from './../../../services/error.service';
import { NotificationService } from './../../../services/notification.service';
import { RequestsService } from './../../../services/requests.service';
import { DateAdapter } from '../../../shared/dateAdapter';

@Component({
  selector: 'app-external-registration-modal',
  templateUrl: './external-registration-modal.component.html',
  styleUrls: ['./external-registration-modal.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter,
      useValue: new MomentDateFormatter
    },
    {
      provide: NgbDateAdapter,
      useValue: new DateAdapter
    }
   ]
})
export class ExternalRegistrationModalComponent implements OnInit {
  form: FormGroup;
  formData = new FormData();

  default_file_name = 'Файл не выбран'

  min_start_date = null
  max_start_date = null

  min_end_date = null
  max_end_date = null


  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private requestsService: RequestsService,
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      deloved_id: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9 -]*$")]),
      fio: new FormControl('', [Validators.required, Validators.maxLength(50)]),

      start_date: new FormControl('', [Validators.required]),
      end_date: new FormControl('', [Validators.required]),

      file: new FormControl(null, [Validators.required]),
      file_name: new FormControl(this.default_file_name),
    })
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

    // Ограничение для даты начала
    dateStartSelect(event) {
      // Назначение для даты окончания + 3 года с даты начала
      this.max_end_date = { year: event.year + 3, month: event.month, day: event.day }
      this.min_end_date = { year: event.year, month: event.month, day: event.day + 1 }
    }

    // Ограничение для даты окончания
    dateEndSelect(event) {
      // Назначение для даты начала - 3 года с даты окночания
      this.max_start_date = { year: event.year, month: event.month, day: event.day - 1 }
      this.min_start_date = { year: event.year - 3, month: event.month, day: event.day }
    }


  onSubmit() {
    this.formData.delete('deloved_id');
    this.formData.delete('fio');
    this.formData.delete('start_date');
    this.formData.delete('end_date');

    this.formData.append('deloved_id', this.form.value.deloved_id);
    this.formData.append('fio', this.form.value.fio);
    this.formData.append('start_date', this.form.value.start_date);
    this.formData.append('end_date', this.form.value.end_date);

    this.requestsService.registrationExternalDoc(this.formData)
      .subscribe((response) => {
        this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});
        this.activeModal.close();
      },
      (error) => {
        this.error.handling(error)
      })
  }

}
