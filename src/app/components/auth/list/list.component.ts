import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthHelper } from '@iss/ng-auth-center';

import { RequestsService } from '../../../services/requests.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ErrorService } from 'src/app/services/error.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private router: Router,
    private authHelper: AuthHelper,
    private notification: NotificationService,
    private error: ErrorService
  ) { }

  lists

  ngOnInit(): void {
    // отправляется таб.номер пользователя
    this.requestsService.getList(this.authHelper.getJwtPayload()['tn']).subscribe((response) => {

      this.lists = []
      this.lists.push(response['mine'])
      this.lists.push(response['to_me'])

      // Убрать вложенности
      this.lists = this.lists.reduce((acc, val) => acc.concat(val), []);

      this.preparingList()
    },
    (error) => {
      this.lists = []

      this.error.handling(error)
    })
  }

  /*
    Сортировать по дате
  */
  preparingList() {
    this.lists = this.lists.sort((a: any, b: any) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  // Создать на основе сформированной доверенности
  createOnBase(id: number):void {
    this.router.navigateByUrl(`/new/${id}`);
  }

  // Скачать документ
  downloadDoc(id: number, status: number):any {
    this.requestsService.downloadFile(id)
      .subscribe((response: Blob) => {
        console.log('blob', response)

        let file = new Blob([response], { type: response.type });
        let fileURL = URL.createObjectURL(file);

        let fileLink = document.createElement('a');
        fileLink.href = fileURL;

        let nameFile = status == 1 ? 'Скан' : 'Доверенность'
        fileLink.download = `${nameFile}_${id}`;

        fileLink.click();
      },
      (error) => {
        this.error.handling(error)
      })
  }

  // Удалить доверенность
  deleteDoc(id: number): void {
    if(confirm(`Вы действительно хотите удалить "Доверенность_${id}.pdf"?`)) {
      this.requestsService.deleteDocument(id)
      .subscribe((response) => {
        this.notification.show(response.result, { classname: 'bg-success text-light', headertext: 'Успешно'});

        this.ngOnInit()
      },
      (error) => {
        console.error(error)
        this.error.handling(error)
      })
    }
  }
}
