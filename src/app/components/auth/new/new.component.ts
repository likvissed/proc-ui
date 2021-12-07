import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestsService } from '../../../services/requests.service';
import { Request } from '../../../interfaces';

import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from '../../../shared/dateFormat';
import { UsersReferenceService } from 'src/app/services/users-reference.service';
import { Observable } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';

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
  // @ViewChild(NgSelectComponent) ngSelectComponent: NgSelectComponent;

  form: FormGroup;
  authority: FormArray;

  constructor(
    private requestsService: RequestsService,
    private userReference: UsersReferenceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  // Список полномочий для пользователя
  // lists = []
  lists = ["12432432 2", "long pre sd asd erewrfwe wef wefewfhuefhe ufheufheufhewifhweflong pre sd asd erewrfwe wef wefewfhuefhe ufheufheufhewifhweflong pre sd asd erewrfwe wef wefewfhuefhe ufheufheufhewifhwef"]

  // Срок доверенности
  arr_selected_time = [
    { value: 1, name: '1 год' },
    { value: 2, name: '2 года'},
    { value: 3, name: '3 года' }
  ]

  // Выбранное или введенное полномочие пользователем
  selected = null;

  ngOnInit() {
    console.log('NewComponent this', this)

    this.form = this.formBuilder.group({
      // Данные, которые пользователь вводит на форме
      tn: new FormControl(null, [Validators.required]),
      sn_passport: new FormControl(null, [Validators.required]),
      passport_issued: new FormControl(null, [Validators.required]),
      date_passport: [null, [Validators.required]],
      code_passport: [null, [Validators.required]],
      date_start: [null, [Validators.required]],
      date_end: [null, [Validators.required]],
      select_time: new FormControl(this.arr_selected_time[0].value, [Validators.required]),
      general: [null, [Validators.required]],
      array_authority: this.formBuilder.array([]),
      // array_authority: this.formBuilder.array([this.formBuilder.group([null, [Validators.required]])]),

      // Данные, которые получаем из НСИ для доверенного лица
      fio: [null, [Validators.required]],
      login: [null, [Validators.required]],
      profession: [null, [Validators.required]],

      // Данные, которые получаем из НСИ для составителя доверенности
      author_tn: [null, [Validators.required]],
      author_fio: [null, [Validators.required]],
      author_login: [null, [Validators.required]]
    })

    this.route.data.subscribe( data => {
      // console.log('presentRequest', data.presentRequest)

      if (data.presentRequest) {

        this.form.setControl('tn', new FormControl(data.presentRequest.tn))
        this.form.setControl('passport', new FormControl(data.presentRequest.passport))
        this.form.setControl('date_passport', new FormControl(this.strToDate(data.presentRequest.date_passport)))
        this.form.setControl('date_start', new FormControl(this.strToDate(data.presentRequest.date_start)))
        this.form.setControl('date_end', new FormControl(this.strToDate(data.presentRequest.date_end)))

        // Заполнение списка полномочий
        let array = this.getFormsArray()
        data.presentRequest.array_authority.forEach(str => {
          array.push(new FormControl(str))
        })

        this.getDuties()
        this.findUser()

        console.log('Form', this.strToDate(data.presentRequest.date_passport))

        // this.findUser();
      }

    })
  }

  // Добавить выбранный элемент в список полномочий
  addSelected(selected):void {
    if (selected != undefined) {
      (<FormArray>this.form.controls["array_authority"]).push(new FormControl(selected))

    }

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

  // Поиск пользователя и список полномочий для него
  findUser() {
    // console.log('cmp', this.requestsService.getDuties(this.form.value.tn))

    this.userReference.findUserByTn(this.form.value.tn).subscribe(user => {
      console.log('USER CMP', user)
      if (user.length) {
        this.form.setControl('fio', new FormControl(user[0]['fullName']))
        this.form.setControl('login', new FormControl(user[0]['login']))
        this.form.setControl('profession', new FormControl(user[0]['professionForDocuments']))

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
        // this.lists = response['duties']
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
  }

  getFormsArray() : FormArray {
    return this.form.controls['array_authority'] as FormArray;
  }

  // datePassportSelect(event) {;
  //   let year = event.year;
  //   let month = event.month <= 9 ? '0' + event.month : event.month;;
  //   let day = event.day <= 9 ? '0' + event.day : event.day;;
  //   let finalDate = day + "-" + month + "-" + year;

  //   this.form.setControl('date_passport', new FormControl(finalDate))
  // }


  submit() {
    // Оствляю до реализации авторизации
    this.form.setControl('author_tn', new FormControl('21056'))
    this.form.setControl('author_fio', new FormControl('Бартузанова Анжелика Николаевна'))
    this.form.setControl('author_login', new FormControl('BartuzanovaAN'))


      // let date_passport = `${this.form.value.date_passport.year}-${this.form.value.date_passport.month}-${this.form.value.date_passport.day}`
    // // this.form.setControl('date_start', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))
    // // this.form.setControl('date_end', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))

    console.log('submit', this.form)
    if (this.form.invalid) {
      return
    }

    // this.form.getRawValue(); // !!!!!!

    // let date_passport = `${this.form.value.date_passport.year}-${this.form.value.date_passport.month}-${this.form.value.date_passport.day}`
    // var date = (new Date(date_passport)).toISOString().split('T')[0];
    // console.log('date_passport', date)

    // const req : Request = {
    //   tn: this.form.value.tn,
    //   passport: this.form.value.passport,
    //   date_passport: this.form.value.date_passport,
    //   date_start: this.form.value.date_start,
    //   date_end: this.form.value.date_end,
    //   array_authority: this.form.value.array_authority,

    //   fio: this.form.value.fio,
    //   login: this.form.value.login,
    //   profession: this.form.value.profession,

    //   author_tn: this.form.value.author_tn,
    //   author_fio: this.form.value.author_fio,
    //   author_login: this.form.value.author_login
    // }

    // console.log('request', req)


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
