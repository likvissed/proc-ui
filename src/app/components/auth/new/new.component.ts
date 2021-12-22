import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthHelper } from '@iss/ng-auth-center';

import { Request } from '../../../interfaces';
import { MomentDateFormatter } from '../../../shared/dateFormat';

import { RequestsService } from '../../../services/requests.service';
import { UsersReferenceService } from 'src/app/services/users-reference.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorService } from 'src/app/services/error.service';

import { TemplateModalComponent } from './../template-modal/template-modal.component';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter,
      useValue: new MomentDateFormatter
    }
   ]
  // encapsulation: ViewEncapsulation.None
})
export class NewComponent implements OnInit {
  form: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private userReference: UsersReferenceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notification: NotificationService,
    private error: ErrorService,
    private authHelper: AuthHelper
  ) { }

  // Список полномочий для пользователя
  lists = []

  // Срок доверенности
  arr_selected_time = [
    { value: 1, name: '1 год' },
    { value: 2, name: '2 года'},
    { value: 3, name: '3 года' }
  ]

  // Выбранное или введенное полномочие пользователем
  selected = null;

  // Нажание на кнопку "Сформировать документ"
  submitted = false;

  ngOnInit() {
    this.form = this.formBuilder.group({
      // Данные, которые пользователь вводит на форме
      tn: new FormControl(null, [Validators.required, Validators.maxLength(10), Validators.pattern("^[0-9]*$")]),
      sn_passport: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
      passport_issued: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      date_passport: [null, [Validators.required]],
      code_passport: [null, [Validators.required, Validators.maxLength(7)]],
      date_start: [null, [Validators.required]],
      select_time: new FormControl(this.arr_selected_time[0].value, [Validators.required]),
      general: [null, [Validators.required, Validators.maxLength(700)]],
      array_authority: this.formBuilder.array([], [Validators.required]),

      // Данные, которые получаем из НСИ для доверенного лица
      fio: [null, [Validators.required]],
      login: [null, [Validators.required]],
      profession: [null, [Validators.required]],
      case_fio: [null, [Validators.required]],
      case_prof: [null, [Validators.required]],
      genitive_fio: [null, [Validators.required]],

      // Данные, которые получаем из НСИ для составителя доверенности
      author_tn: [this.authHelper.getJwtPayload()['tn'], [Validators.required]],
      author_fio: [this.authHelper.getJwtPayload()['fio'], [Validators.required]],
      author_login: [this.authHelper.getJwtPayload()['login'], [Validators.required]]
    })

    this.route.data.subscribe( data => {
      if (data.presentRequest) {
        this.form.controls['tn'].setValue(data.presentRequest.tn);
        this.form.controls['sn_passport'].setValue(data.presentRequest.sn_passport);
        this.form.controls['passport_issued'].setValue(data.presentRequest.passport_issued);
        this.form.controls['date_passport'].setValue(this.strToDate(data.presentRequest.date_passport));
        this.form.controls['code_passport'].setValue(data.presentRequest.code_passport);
        this.form.controls['date_start'].setValue(this.strToDate(data.presentRequest.date_start));
        this.form.controls['select_time'].setValue(data.presentRequest.select_time);
        this.form.controls['general'].setValue(data.presentRequest.general);

        // Заполнение списка полномочий
        let array = this.getFormsArray()
        data.presentRequest.array_authority.forEach(str => {
          array.push(new FormControl(str, [Validators.required]))
        })

        this.getDuties()
        this.findUser()
      }

    })
  }

  clearArray() {
    (this.form.get('array_authority') as FormArray).clear();
  }


  // Добавить выбранный элемент в список полномочий
  addSelected(selected) {
    if (selected != undefined) {
      let not_uniq =  this.form.value.array_authority.find(x => x == selected);

      if (selected.length > 700) {
        return
      }

      // Проверка, если в списке полномочий нет такого значения, то можно добавить в массив
      if (not_uniq == undefined) {
        (<FormArray>this.form.controls["array_authority"]).push(new FormControl(selected))
      }
    }

    // Очистить поле ввода полномочий
    this.selected = []
  }

  // Получить из строки 'гггг-мм-дд' объект даты для отображения в календаре
  strToDate(str: string) {
    let date = new Date(str)

    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1, // January is month 0
      day: date.getDate()
    }
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  // Поиск пользователя и список полномочий для него
  findUser() {
    this.userReference.findUserByTn(this.form.value.tn).subscribe(user => {
      if (user.length) {
        this.form.controls['fio'].setValue(user[0]['fullName'])
        this.form.controls['login'].setValue(user[0]['login'])
        this.form.controls['profession'].setValue(this.titleCaseWord(user[0]['professionForDocuments']))


        this.userReference.findUserById(user[0]['id']).subscribe(user => {
          if (user) {
            this.form.controls['case_prof'].setValue(user['employeePositions'][0]['professionDeclensions']['accusativeProfession'])

            let employeeDeclensions = user['employeeDeclensions']
            this.form.controls['case_fio'].setValue(`${this.titleCaseWord(employeeDeclensions['accusativeLastName'])} ${this.titleCaseWord(employeeDeclensions['accusativeName'])} ${this.titleCaseWord(employeeDeclensions['accusativeMiddleName'])}`)
            this.form.controls['genitive_fio'].setValue(employeeDeclensions['genitiveLastName'])

          } else {
            this.form.controls['case_prof'].setValue('')
            this.form.controls['case_fio'].setValue('')
            this.form.controls['genitive_fio'].setValue('')
          }
        })

        this.getDuties()
      } else {
        this.form.controls['fio'].setValue('')
        this.form.controls['login'].setValue('')
        this.form.controls['profession'].setValue('')

        this.lists = []


      }
    })
  }

  // Получить список полномочий для конкретного пользователя
  getDuties() {
    this.requestsService.getDuties(this.form.value.tn)
      .subscribe((response) => {
        this.lists = response['duties']
      },
      (error) => {
        this.error.handling(error)
      })
  }

  getFormsArray() : FormArray {
    return this.form.controls['array_authority'] as FormArray;
  }

  datePassportSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = day + "-" + month + "-" + year;

    this.form.controls['date_passport'] = new FormControl(finalDate);
  }

  dateToString(date) {
    let year = date.year;
    let month = date.month <= 9 ? '0' + date.month : date.month;;
    let day = date.day <= 9 ? '0' + date.day : date.day;;
    let finalDate = year + "-" + month + "-" + day;

    return finalDate
  }

  submit() {
    if (this.form.invalid) {
      // console.log(this.form.value)
      return
    }
    this.submitted = true;

    let date_passport = this.dateToString(this.form.value.date_passport)
    let date_start = this.dateToString(this.form.value.date_start)

    const req : Request = {
      tn: this.form.value.tn,
      sn_passport: this.form.value.sn_passport,
      passport_issued: this.form.value.passport_issued,
      date_passport: date_passport,
      code_passport: this.form.value.code_passport,
      date_start: date_start,
      select_time: this.form.value.select_time,
      general: this.form.value.general,
      array_authority: this.form.value.array_authority,

      fio: this.form.value.fio,
      login: this.form.value.login,
      profession: this.form.value.profession,
      case_fio: this.form.value.case_fio,
      case_prof: this.form.value.case_prof,
      genitive_fio: this.form.value.genitive_fio,

      author_tn: this.form.value.author_tn,
      author_fio: this.form.value.author_fio,
      author_login: this.form.value.author_login
    }

     this.requestsService.templateFile(req)
      .subscribe((response) => {
        const modalRef = this.modalService.open(TemplateModalComponent, { size: 'xl', scrollable: true, backdrop: 'static' })
        modalRef.componentInstance.templateFile = response
        modalRef.componentInstance.request = req

        this.submitted = false
      },
      (error) => {
        this.submitted = false

        this.error.handling(error)
      })
  }

  // Добавить новую строку выбора из списка полномочий
  addElement() {
    if (this.lists.length != 0) {
      (<FormArray>this.form.controls["array_authority"]).push(new FormControl(null,  [Validators.required]))
    }

  }

  // Удалить конкретный элемент из массива
  deleteElement(index: number): void {
    (<FormArray>this.form.controls["array_authority"]).removeAt(index)
  }

}
