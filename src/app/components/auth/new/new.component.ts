import { TemplateModalComponent } from './../template-modal/template-modal.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestsService } from '../../../services/requests.service';
import { Request } from '../../../interfaces';

import { NgbActiveModal, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from '../../../shared/dateFormat';
import { UsersReferenceService } from 'src/app/services/users-reference.service';
import { Observable } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { formatDate } from '@angular/common';

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
    private modalService: NgbModal
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
      general: [null, [Validators.required, Validators.maxLength(255)]],
      array_authority: this.formBuilder.array([]),

      // Данные, которые получаем из НСИ для доверенного лица
      fio: [null, [Validators.required]],
      login: [null, [Validators.required]],
      profession: [null, [Validators.required]],
      case_fio: [null, [Validators.required]],
      case_prof: [null, [Validators.required]],
      genitive_fio: [null, [Validators.required]],

      // Данные, которые получаем из НСИ для составителя доверенности
      author_tn: [null, [Validators.required]],
      author_fio: [null, [Validators.required]],
      author_login: [null, [Validators.required]]
    })

    this.route.data.subscribe( data => {
      if (data.presentRequest) {
        console.log('presentRequest', data.presentRequest)

        this.form.setControl('tn', new FormControl(data.presentRequest.tn))
        this.form.setControl('sn_passport', new FormControl(data.presentRequest.sn_passport))
        this.form.setControl('passport_issued', new FormControl(data.presentRequest.passport_issued))
        this.form.setControl('date_passport', new FormControl(this.strToDate(data.presentRequest.date_passport)))
        this.form.setControl('code_passport', new FormControl(data.presentRequest.code_passport))
        this.form.setControl('date_start', new FormControl(this.strToDate(data.presentRequest.date_start)))
        this.form.setControl('select_time', new FormControl(data.presentRequest.select_time))
        this.form.setControl('general', new FormControl(data.presentRequest.general))

        // Заполнение списка полномочий
        let array = this.getFormsArray()
        data.presentRequest.array_authority.forEach(str => {
          array.push(new FormControl(str))
        })

        this.getDuties()
        this.findUser()

        console.log('Form', this.strToDate(data.presentRequest.date_passport))
      }

    })
  }

  clearArray() {
    (this.form.get('array_authority') as FormArray).clear();
  }

  openFormModal() {
    const modalRef = this.modalService.open(TemplateModalComponent);

    // modalRef.result.then((result) => {
    //   console.log(result);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  // Добавить выбранный элемент в список полномочий
  addSelected(selected) {
    if (selected != undefined) {
      let not_uniq =  this.form.value.array_authority.find(x => x == selected);

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
    // console.log('cmp', this.requestsService.getDuties(this.form.value.tn))

    this.userReference.findUserByTn(this.form.value.tn).subscribe(user => {
      console.log('USER CMP', user)
      if (user.length) {
        this.form.setControl('fio', new FormControl(user[0]['fullName']))
        this.form.setControl('login', new FormControl(user[0]['login']))
        this.form.setControl('profession', new FormControl(user[0]['professionForDocuments']))

        this.userReference.findUserById(user[0]['id']).subscribe(user => {
          console.log('EMP USER CMP', user)
          if (user) {
            this.form.setControl('case_prof', new FormControl(user['employeePositions'][0]['professionDeclensions']['accusativeProfession']))

            let employeeDeclensions = user['employeeDeclensions']
            this.form.setControl('case_fio', new FormControl(`${this.titleCaseWord(employeeDeclensions['accusativeLastName'])} ${this.titleCaseWord(employeeDeclensions['accusativeName'])} ${this.titleCaseWord(employeeDeclensions['accusativeMiddleName'])}`))
            this.form.setControl('genitive_fio', new FormControl(employeeDeclensions['genitiveLastName']))

          } else {
            this.form.setControl('case_prof', new FormControl(null))
            this.form.setControl('case_fio', new FormControl(null))
            this.form.setControl('genitive_fio', new FormControl(null))
          }
        })

        this.getDuties()
      } else {
        this.form.setControl('fio', new FormControl(null))
        this.form.setControl('login', new FormControl(null))
        this.form.setControl('profession', new FormControl(null))

        this.lists = []


      }
      console.log('findUser form', this.form)
    })
  }

  // Получить список полномочий для конкретного пользователя
  getDuties() {
    this.requestsService.getDuties(this.form.value.tn)
      .subscribe((response) => {
        this.lists = response['duties']
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
  }

  getFormsArray() : FormArray {
    return this.form.controls['array_authority'] as FormArray;
  }

  datePassportSelect(event) { //  (dateSelect)="datePassportSelect($event)"
    console.log('event', event)
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = day + "-" + month + "-" + year;

    this.form.controls['date_passport'] = new FormControl(finalDate);
    // console.log('control', this.form.controls['date_passport'] )
    // this.form.setControl('date_passport', new FormControl(finalDate))
  }

  dateToString(date) {
    console.log('event date', date)
    let year = date.year;
    let month = date.month <= 9 ? '0' + date.month : date.month;;
    let day = date.day <= 9 ? '0' + date.day : date.day;;
    let finalDate = year + "-" + month + "-" + day;

    return finalDate
  }

  submit() {

    // Оствляю до реализации авторизации
    this.form.setControl('author_tn', new FormControl('21056'))
    this.form.setControl('author_fio', new FormControl('Бартузанова Анжелика Николаевна'))
    this.form.setControl('author_login', new FormControl('BartuzanovaAN'))


    // console.log('Date: ', new Date(this.form.value.date_passport).toDateString());
    // console.log('Date: ', this.form.value.date_passport);

      // let date_passport = `${this.form.value.date_passport.year}-${this.form.value.date_passport.month}-${this.form.value.date_passport.day}`
    // this.form.setControl('date_start', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))
    // // this.form.setControl('date_end', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))

    console.log('submit', this.form)

    // const modalRef = this.modalService.open(TemplateModalComponent, { size: 'xl', scrollable: true })
    // modalRef.componentInstance.request = this.form.value

    // modalRef.result.then((result) => {
    //   console.log('result', result);
    // }).catch((error) => {
    //   console.log('error', error);
    // });


    // this.activeModal.close("Submit")
    // this.activeModal.open(NgbdModalContent);
    if (this.form.invalid) {
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

    console.log('RESULT request', req)


     // this.form.getRawValue(); !!!
     this.requestsService.templateFile(req)
      .subscribe((response) => {
        console.log('response', response)

        const modalRef = this.modalService.open(TemplateModalComponent, { size: 'xl', scrollable: true })
        modalRef.componentInstance.templateFile = response
        modalRef.componentInstance.request = req

        this.submitted = false
      },
      (error) => {
        this.submitted = false
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })


  }

  // Добавить новую строку выбора из списка полномочий
  addElement() {
    if (this.lists.length != 0) {
      (<FormArray>this.form.controls["array_authority"]).push(new FormControl(null,  [Validators.required]))
    // } else {
      // alert 'Пользователь с табельным номером ${} не найден
    }

  }

  // Удалить конкретный элемент из массива
  deleteElement(index: number): void {
    (<FormArray>this.form.controls["array_authority"]).removeAt(index)
  }

}
