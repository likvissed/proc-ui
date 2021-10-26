import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestsService } from '../../../services/requests.service';
import { Request } from '../../../interfaces';

import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { MomentDateFormatter } from '../../../shared/dateFormat';
import { UsersReferenceService } from 'src/app/services/users-reference.service';
import { Observable } from 'rxjs';

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
    private router: Router
  ) { }

  // Список полномочий для пользователя
  lists = []

  min_start_date = null
  max_start_date = null

  min_end_date = null
  max_end_date = null

  ngOnInit() {
    console.log('NewComponent this', this)

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

        console.log('Form', this.strToDate(data.presentRequest.date_passport))

        // this.findUser();
      }

    })
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
    this.userReference.findUserByTn(this.form.value.tn).subscribe(user => {
      console.log('USER CMP', user)
      if (user) {
        this.form.setControl('fio', new FormControl(user['fullName']))
        this.form.setControl('login', new FormControl(user['login']))
        this.form.setControl('profession', new FormControl(user['professionForDocuments']))

        this.getDuties()
        console.log('findUser form', this.form)
      }
    })
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
    console.log('start', event)
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
