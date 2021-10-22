import { environment } from './../environments/environment';
import { Request } from './interfaces';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class RequestsService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  token = ''

  request = {}
  // create(req: Request): <any> {
  //   console.log('VALID API', req)
  //   // return this.http.post(`${environment.fbDBUrl}/posts.json`, post)
  //   //   .pipe(map((response: FbCreateResponse) => {  // map позволяет трансформировать данные из стрима
  //   //     const newPost: Post = {
  //   //         ...post,  // оператор spred для объекта post
  //   //         id: response.name,
  //   //         date: new Date(post.date)
  //   //     } // не помогло  as Post (ненужно)

  //   //     return newPost
  //   //   }))
  // }
  valid(req: Request): Observable<Request> {
    return this.http.post<Request>(`${environment.serverUrl}/requests`, req)
  }

  // Найти пользователя в НСИ
  findUsersReference(tn: number): any {
    return this.http.get(`${environment.usersReferenceUrl}=personnelNo==${tn}`, {
      headers: new HttpHeaders({
        'X-Auth-Token': this.token
      })
    })
  }

  // Получить список полномочий для конкретного пользователя
  getDuties(tn: number): any {

    return this.http.post(`${environment.procListDutiesUrl}`, {'tn': tn}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
  }

  // Получить сформированный образец документа
  templateFile(request: Request): Observable<Request> {
    const requestOptions: Object = {
      responseType: 'blob'
    }

    return this.http.post<Request>(`${environment.procGetTemplateDocUrl}`, request , requestOptions)
  }

  // Отправить данные на согласование доверенности
  sendForApproval(request: Request): Observable<Request> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<Request>(`${environment.procSendDocUrl}`, request, { headers })
  }

  // Получить список доверенностей
  getList(current_user_tn: number): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`${environment.procGetListUrl}`, { author_tn: current_user_tn } , { headers })
  }

  // Получить json с параметрами сформитрованного документа
  // procGetJsonDocUrl
  getJsonDoc(id: number): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`${environment.serverUrl}`, { id: id } , { headers })

    // let response = this.http.post(`${environment.procGetJsonDocUrl}`, { id: id_doc } , { headers })
    this.http.post(`${environment.serverUrl}`, { id: id } , { headers }).subscribe(data  => {
      console.log('response yes', data)
    },
    error => {
      console.log('response no', error)
    });

    // console.log('S getJsonDoc response', response)
  }

}
