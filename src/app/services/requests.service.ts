import { environment } from '../../environments/environment';
import { Request, WithdrawForm } from '../interfaces';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class RequestsService {
  constructor(
    private http: HttpClient
  ) {}

  // ---------------------------------- Создание доверенности ----------------------------------

  // Получить список полномочий для конкретного пользователя
  getDuties(tn): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('tn', tn);

    return this.http.get(`${environment.apiUrl}/duties_list`, { headers: headers, params: params })
  }

  // Получить сформированный образец документа
  templateFile(request: Request): any {
    const requestOptions: Object = {
      responseType: 'blob'
    }

    return this.http.post<Request>(`${environment.apiUrl}/sample`, request , requestOptions)
  }

  // Отправить данные на согласование доверенности
  sendForApproval(request): any{
    return this.http.post(`${environment.apiUrl}/ssd_send`, request,  { responseType: 'blob' } )
  }

  // Получить список доверенностей
  getList(current_user_tn, filters, currentPage, pageSize): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('author_tn', current_user_tn)
      .set('filters', JSON.stringify(filters))
      .set('page', currentPage)
      .set('size', pageSize);

    return this.http.get(`${environment.apiUrl}/proxies_list`, { headers: headers, params: params })
  }

  // Проверить доступ у пользователя на печать документа без отправки в ССД
  checkAccessUserPrint(tn: number): any {
    return this.http.get(`${environment.apiUrl}/print_access?tn=${tn}`)
  }

  // Получить json с параметрами сформитрованного документа
  getJsonDoc(id: number): any {
    return this.http.get(`${environment.apiUrl}/docx_info?id=${id}`)
  }

  // ---------------------------------- Список документов ----------------------------------

  // Скачать доверенность
  downloadFile(id: number): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.post(`${environment.apiUrl}/file_download`, { id: id } , { headers, responseType: 'blob' })
  }

  // Удалить доверенность
  deleteDocument(id: number): any {
    return this.http.delete(`${environment.apiUrl}/delete_proxy/${id}`)
  }

  // ---------------------------------- Канцелярия ----------------------------------

  // Список доверенностей для вкладки "Канцелярия" - только действительные и согласованные
  getChancellery(filters, currentPage, pageSize): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('filters', JSON.stringify(filters))
      .set('page', currentPage)
      .set('size', pageSize);

    return this.http.get(`${environment.apiUrl}/agreed_proxies`, { headers: headers, params: params })
  }

  // Отозвать доверенность
  withdrawDocument(form_withdraw): any {
    return this.http.post(`${environment.apiUrl}/proxy_revoke`, form_withdraw)
  }

  // Найти согласованную доверенность по id
  findDocument(id: number): any {
    return this.http.get(`${environment.apiUrl}/proxy_search?id=${id}`)
  }

  // Назначить номер доверенности и загрузить скан
  registrationDocument(form_data): any {
    let headers = new HttpHeaders();
    headers.set('Content-Type', undefined);

    return this.http.post(`${environment.apiUrl}/add_deloved_id`, form_data , { headers })
  }

  // Список пользователей, у кого есть доступ на печать документа
  getUsersPrint(): any {
    return this.http.get(`${environment.apiUrl}/print_list`)
  }

  // Разрешить пользователю доступ на печать документа без отправки в ССД
  addUserPrint(tn): any {
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');

    return this.http.post(`${environment.apiUrl}/print_add`, { tn: tn } , { headers })
  }

  // Удалить доступ у пользователя
  deleteUserPrint(id: number): any {
    return this.http.delete(`${environment.apiUrl}/print_delete/${id}`)
  }

  // ---------------------------------- Полномочия ----------------------------------

  // Список всех полномочий для юристов
  getAuthority(filters, currentPage, pageSize): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    const params = new HttpParams()
      .set('filters', JSON.stringify(filters))
      .set('page', currentPage)
      .set('size', pageSize);

    return this.http.get(`${environment.apiUrl}/all_duties`, { headers: headers, params: params })
  }

  // Удалить полномочие
  deleteAuthority(id: number): any {
    return this.http.delete(`${environment.apiUrl}/remove_duty/${id}`)
  }

  // Добавить новое полномочие
  addAuthority(data): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this.http.post(`${environment.apiUrl}/add_duty`, data , { headers })
  }

  // Обновить полномочие
  updateAuthority(data): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')

    return this.http.put(`${environment.apiUrl}/edit_duty`, data , { headers })
  }

  // Найти пользователя в НСИ по таб.номеру
  findUserByTn(tn: number): any {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    return this.http.get(`${environment.apiUrl}/tn_search?tn=${tn}`, { headers })
  }
}
