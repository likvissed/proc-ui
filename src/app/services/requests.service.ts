import { environment } from '../../environments/environment';
import { Request, WithdrawForm } from '../interfaces';
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

  // // Отправить данные на согласование доверенности
  // sendForApproval(request: Request): Observable<Request> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   // responseType: 'text'
  //   // const requestOptions: Object = {
  //   //   responseType: 'json'
  //   // }

  //   return this.http.post<Request>(`${environment.procSendDocUrl}`, request, { headers })
  // }

  // Отправить данные на согласование доверенности
  sendForApproval(request): any{
    return this.http.post(`${environment.procSendDocUrl}`, request,  { responseType: 'text' } )
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
      .set('Content-Type', 'application/json');
      // .set('Accept', 'application/pdf');

    return this.http.post(`${environment.procDownloadFileUrl}`, { id: id } , { headers, responseType: 'blob' })
  }

  // Удалить доверенность
  deleteDocument(id: number): any {
    return this.http.delete(`${environment.procDeleteDocUrl}/${id}`, { responseType: 'text' })
  }

  // Список доверенностей для вкладки "Канцелярия" - только действительные и согласованные
  getChancellery(): any {
    return this.http.get(`${environment.procListChancellyUrl}`)
  }

  // Отозвать доверенность
  withdrawDocument(form_withdraw): any {
    return this.http.post(`${environment.procWithdrawChancellyUrl}`, form_withdraw , { responseType: 'text' })
  }

  // Найти согласованную доверенность по id
  findDocument(id: number): any {
    return this.http.get(`${environment.procSearchDocChancellyUrl}?id=${id}`)
  }

  // Назначить номер доверенности и загрузить скан
  registrationDocument(form_data): any {
    let headers = new HttpHeaders();
    headers.set('Content-Type', undefined);

    return this.http.post(`${environment.addNumberAndScanDocUrl}`, form_data , { headers })
  }

}
