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

    return this.http.post(environment.usersReferenceUrlLogin, {}, { headers } )
  }

  // Запрос в НСИ
  findUser(tn: number):any {
    return this.http.get(`${environment.usersReferenceUrl}=personnelNo==${tn}`, {
      headers: new HttpHeaders({
        'X-Auth-Token': localStorage.getItem('token_hr')
      })
    })
  }

  // Найти пользователя в НСИ
  findUserByTn(tn: number): any {
    return this.findUser(tn)
      .pipe(
        map((response:any) => response.data),
        catchError(_ => of('Error')),
        switchMap((el:any) => {
          if (el == 'Error') {
            return this.getNewToken()
              .pipe(
                mergeMap((data) =>{
                  localStorage.setItem('token_hr', data['token'])

                  return this.findUser(tn)
                    .pipe(
                      switchMap((response:any) => response.data)
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
