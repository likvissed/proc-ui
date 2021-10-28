import { environment } from '../../environments/environment';
import { Request } from '../interfaces';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})

export class RequestsService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // Получить список полномочий для конкретного пользователя
  getDuties(tn: number): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this.http.post(environment.procListDutiesUrl, { 'tn': tn }, { headers: headers })
      // .subscribe((response) => {
      //   console.log('duties', response)

      // },
      // (error) => {
      //   console.error('error', error)
      // })

    // this.http.get(`${environment.procListDutiesUrl}=tn==${tn}`, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //   })
    // })
    //    .subscribe((response) => {
    //     console.log('duties', response)

    //   },
    //   (error) => {
    //     console.error('error', error)
    //   })



    // return this.http.post(`${environment.procListDutiesUrl}`, {'tn': tn}, {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/json'
    //     // 'Access-Control-Allow-Origin': '*',
    //     //     'Access-Control-Allow-Credentials': 'true',
    //     //     'Access-Control-Allow-Headers': 'Content-Type',
    //     //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'
    //   })
    // })
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
    // const headers = new HttpHeaders().set('Content-Type', 'application/json');

    // return this.http.post(`${environment.procGetListUrl}`, { author_tn: current_user_tn } , { headers })

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this.http.post(environment.procGetListUrl, { 'author_tn': current_user_tn }, { headers })
  }

  // Получить json с параметрами сформитрованного документа
  getJsonDoc(id: number): any {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(`${environment.procGetJsonDocUrl}`, { id: id } , { headers })
  }

  // Скачать доверенность
  downloadFile(id: number): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/pdf');

    return this.http.post(`${environment.procDownloadFileUrl}`, { id: id } , { headers, responseType: 'blob' })
  }

}
