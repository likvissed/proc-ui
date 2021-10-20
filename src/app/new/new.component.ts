import { RequestsService } from './../requests.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Request } from './../interfaces';

import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import {MomentDateFormatter} from '../dateFormat';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [
    {
      provide: NgbDateParserFormatter,
      useValue: new MomentDateFormatter
      // useClass: MomentDateFormatter
    }
   ]
  // encapsulation: ViewEncapsulation.None
})
export class NewComponent implements OnInit {

  form: FormGroup;

  constructor(
    private requestsService: RequestsService,
    private formBuilder: FormBuilder
  ) { }

  // // Строка выбора пользователем параметра из списка полномочий
  // selected = ''

  // Список полномочий для пользователя
  lists = []

  min_start_date = null
  max_start_date = null

  min_end_date = null
  max_end_date = null

  ngOnInit() {
    console.log('NewComponent')

    // this.form = new FormGroup({
    //   tn: new FormControl(null, [Validators.required]),
    //   passport: new FormControl(null, [Validators.required]),
    //   date_passport: new FormControl(null, [Validators.required]),
    //   date_start: new FormControl(null, [Validators.required]),
    //   date_end: new FormControl(null, [Validators.required]),
    //   array_authority: new FormArray([])

    //   // array_authority: new FormArray([new FormControl(null)])
    //   // array_authority: new FormArray(null, [Validators.required])
    // })

    this.form = this.formBuilder.group({
      // Данные, которые пользователь вводит на форме
      tn: new FormControl(null, [Validators.required]),
      passport: new FormControl(null, [Validators.required]),
      date_passport: [null, [Validators.required]],
      date_start: [null, [Validators.required]],
      date_end: [null, [Validators.required]],
      array_authority: this.formBuilder.array([]),

      // Данные, которые получаем из НСИ для доверенного лица
      fio: [null, [Validators.required]],
      login: [null, [Validators.required]],
      profession: [null, [Validators.required]],

      // Данные, которые получаем из НСИ для составителя доверенности
      author_tn: [null, [Validators.required]],
      author_fio: [null, [Validators.required]],
      author_login: [null, [Validators.required]]



      // array: new FormArray([ new FormControl(null) ])
      // array: this.formBuilder.array([new FormControl(null)])
    })
  }

  findUser() {
    // console.log('findUser')
    this.requestsService.findUser(this.form.value.tn).subscribe((user) => {
      console.log('USER', user.data[0])
      this.form.setControl('fio', new FormControl(user.data[0]['fullName']))
      this.form.setControl('login', new FormControl(user.data[0]['login']))
      this.form.setControl('profession', new FormControl(user.data[0]['professionForDocuments']))

      // this.form.controls["fio"] = user.data[0]['fullName']
    })

    this.getDuties()
    console.log('findUser form', this.form)
  }

  // Получить список полномочий для конкретного пользователя
  getDuties() {
    // this.requestsService.getDuties(this.form.value.tn).subscribe((response) => {
    //   console.log('duties', response)
    //   this.lists = response['duties']
    // })

    this.lists = [
      'aaa', 'bbb', 'ccc', 'ddd', 'long long long long'
    ];
  }

  getFormsArray() : FormArray{
    return this.form.controls['array_authority'] as FormArray;
  }

  // datePassportSelect(event) {;
  //   let year = event.year;
  //   let month = event.month <= 9 ? '0' + event.month : event.month;;
  //   let day = event.day <= 9 ? '0' + event.day : event.day;;
  //   let finalDate = day + "-" + month + "-" + year;

  //   this.form.setControl('date_passport', new FormControl(finalDate))
  // }

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

  submit() {
    // Оствляю до реализации авторизации
    this.form.setControl('author_tn', new FormControl('21056'))
    this.form.setControl('author_fio', new FormControl('Бартузанова Анжелика Николаевна'))
    this.form.setControl('author_login', new FormControl('BartuzanovaAN'))


      // let date_passport = `${this.form.value.date_passport.year}-${this.form.value.date_passport.month}-${this.form.value.date_passport.day}`
    // // this.form.setControl('date_start', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))
    // // this.form.setControl('date_end', new FormControl(`${this.form.value.date_start.year}-${this.form.value.date_start.month}-${this.form.value.date_start.day}`))

    console.log('submit', this.form.value)
    if (this.form.invalid) {
      return
    }

    // this.form.getRawValue(); // !!!!!!

    const req : Request = {
      tn: this.form.value.tn,
      passport: this.form.value.passport,
      date_passport: this.form.value.date_passport,
      date_start: this.form.value.date_start,
      date_end: this.form.value.date_end,
      array_authority: this.form.value.array_authority,

      fio: this.form.value.fio,
      login: this.form.value.login,
      profession: this.form.value.profession,

      author_tn: this.form.value.author_tn,
      author_fio: this.form.value.author_fio,
      author_login: this.form.value.author_login
    }

    console.log('request', req)

    // // this.requestsService.valid(request).subscribe(() => {
    // //   // this.form.reset()
    // // })
  }

  // Добавить новую строку выбора из списка полномочий
  addElement() {
    // if (this.lists.length != 0) {
      (<FormArray>this.form.controls["array_authority"]).push(new FormControl(null,  [Validators.required]))
    // } else {
      // alert 'Пользователь с табельным номером ${} не найден
    // }

  }

  // Удалить конкретный элемент из массива
  deleteElement(index: number): void {
    (<FormArray>this.form.controls["array_authority"]).removeAt(index)
  }

}
