import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { RequestsService } from '../../../services/requests.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
  // encapsulation: ViewEncapsulation.None
})
export class ListComponent implements OnInit {

  constructor(
    private requestsService: RequestsService,
    private router: Router
  ) { }

  lists

  ngOnInit(): void {
    // отправляется таб.номер пользователя
    this.requestsService.getList(21056).subscribe((response) => {
      // console.log('getList response', response)

      this.lists = []
      this.lists.push(response['mine'])
      this.lists.push(response['to_me'])

      // Убрать вложенности
      this.lists = this.lists.reduce((acc, val) => acc.concat(val), []);

      this.preparingList()
    },
    (error) => {
      this.lists = []
      console.error('error', error)
      alert(`Ошибка ${error.status}. Сервер временно недоступен`)
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
  downloadDoc(id: number):any {
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
        fileLink.download = `Доверенность_${id}.pdf`;

        // triggers the click event
        fileLink.click();
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
  }

  // Удалить доверенность
  deleteDoc(id: number): void {
    if(confirm(`Вы действительно хотите удалить "Доверенность_${id}.pdf"?`)) {
      this.requestsService.deleteDocument(id)
      .subscribe(() => {
        alert('Доверенность успешна уделена')
        this.ngOnInit()
      },
      (error) => {
        console.error('error', error)
        alert(`Ошибка ${error.status}. Сервер временно недоступен`)
      })
    }
  }
}
