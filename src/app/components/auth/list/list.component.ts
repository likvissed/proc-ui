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
    // отправляется таб.номер пользователя
    this.requestsService.getList(21056).subscribe((response) => {
      // console.log('getList response', response)

      this.lists.push(response['mine'])
      this.lists.push(response['to_me'])

      // Убрать вложенности
      this.lists = this.lists.reduce((acc, val) => acc.concat(val), []);

      this.preparingList()
    },
    (error) => {
      console.error('error', error)
      alert(`Ошибка ${error.status}. Сервер временно недоступен`)
    })
  }

  /*
    1. Преобразовать обозначение статусов в текст
    2. Сортировать по дате
  */
  preparingList() {
    this.lists.forEach(function(obj) {
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

    this.lists = this.lists.sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Создать на основе сформированной доверенности
  createOnBase(id: number):void {
    this.router.navigateByUrl(`/new/${id}`);
  }

  // Скачать документ
  downloadDoc(id: number, index: number):any {
    this.requestsService.downloadFile(id)
      .subscribe((response: Blob) => {
        // let blob = new Blob([response], { type: 'application/pdf' });
        // let url= window.URL.createObjectURL(blob);
        // window.open(url, '_blank');

        let file = new Blob([response], { type: 'application/pdf' });
        let fileURL = URL.createObjectURL(file);

        // create <a> tag dinamically
        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        // it forces the name of the downloaded file
        fileLink.download = `Доверенность_${index}.pdf`;

        // triggers the click event
        fileLink.click();
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
  }
}
