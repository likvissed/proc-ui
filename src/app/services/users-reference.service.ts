import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from "rxjs";

@Injectable({providedIn: 'root'})

// Запросы в справочник сотрудников
export class UsersReferenceService {

  constructor(
    private http: HttpClient,
  ) {}

  // Получить новый токен
  getNewToken():any {
    const headers = new HttpHeaders()
      .set('X-Auth-Username', environment.nameUserHr)
      .set('X-Auth-Password', environment.passwordUserHr);

    return this.http.post(`${environment.usersReferenceUrl}/login`, {}, { headers } )
  }

  // Запрос в НСИ по таб.номеру
  findUser(tn: number):any {
    return this.http.get(`${environment.usersReferenceUrl}/emp?search=personnelNo==${tn}`, {
      headers: new HttpHeaders({
        'X-Auth-Token': localStorage.getItem('token_hr')
      })
    })
  }

  // Запрос в НСИ по id_tn
  findUserEmp(id_tn: number):any {
    return this.http.get(`${environment.usersReferenceUrl}/emp/${id_tn}`, {
      headers: new HttpHeaders({
        'X-Auth-Token': localStorage.getItem('token_hr')
      })
    })
  }

  // Найти пользователя в НСИ по таб.номеру
  findUserByTn(tn: number): any {
    return this.findUser(tn)
      .pipe(
        map((response:any) => of(response.data)),
        catchError(_ => of('Error')),
        switchMap((el:any) => {
          if (el == 'Error') {
            return this.getNewToken()
              .pipe(
                mergeMap((data) =>{
                  localStorage.setItem('token_hr', data['token'])

                  return this.findUser(tn)
                    .pipe(
                      switchMap((response:any) => of(response.data))
                  )
                })
              )
          } else {
            return el
          }

        })
      )

  }

  // Найти пользователя в НСИ по id_tn
  findUserById(id_tn: number): any {
    return this.findUserEmp(id_tn)
      .pipe(
        map((response:any) => of(response)),
        catchError(_ => of('Error')),
        switchMap((el:any) => {
          if (el == 'Error') {
            return this.getNewToken()
              .pipe(
                mergeMap((data) =>{
                  localStorage.setItem('token_hr', data['token'])

                  return this.findUserEmp(id_tn)
                    .pipe(
                      switchMap((response:any) => of(response))
                  )
                })
              )
          } else {
            return el
          }

        })
      )

  }
}
