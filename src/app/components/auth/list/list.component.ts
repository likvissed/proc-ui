import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) { }

  lists = []

  ngOnInit(): void {
    this.requestsService.getList(21056).subscribe((response) => {
      console.log('getList response', response)

      this.lists.push(response['mine'])
      this.lists.push(response['to_me'])

    })

    this.lists.push({"id":7,"state":0,"date":"2021-10-21 09:24:39","fio":"Чубреев Илья Олегович","author_fio":"Бартузанова Анжелика Николаевна"})
    this.lists.push({"id":8,"state":0,"date":"2021-10-01 09:59:39","fio":"Бартузанова Анжелика Николаевна","author_fio":"Бартузанова Анжелика Николаевна"})

    console.log('lists', this.lists)

    /*
      1. Преобразовать обозначение статусов в текст
      2. Сортировать по дате
      3?. Изменить id чтобы был зашифрованный
     */
      this.lists.forEach(function(obj, index) {
        switch (obj['state']) {
          case 0:
            obj['full_state'] = 'Новая'
            break;
          case 1:
            obj['full_state'] = 'Действующая'
            break;
          case 2:
            obj['full_state'] = 'Просрочена'
            break;
          case 3:
            obj['full_state'] = 'Отклонена'
            break;
          default:
            obj['full_state'] = '-'
        }
      });

      // this.lists = this.lists.filter((list: any) => {
      //   return list.date.getTime() <= new Date().getTime();
      // });

    // if (this.lists.length) {
    // }
  }

  // Создать на основе сформированной доверенности
  createOnBase(id: number):void {
    this.router.navigateByUrl(`/new/${id}`);
  }

}
