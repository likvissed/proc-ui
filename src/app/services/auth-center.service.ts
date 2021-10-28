import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })

export class AuthCenter {
  constructor(
    private http: HttpClient
  ) {}

  // Авторизация в ЛК
  authorizeUrl() {
    return `${environment.authorizationUrl}?client_id=${environment.clientId}&response_type=code&redirect_uri=${environment.redirectUrl}&state=123456&scope=`
  }

  // Получение токена доступа
  getToken() {
    const params = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('client_secret', 'authorization_code')


    return this.http.post(environment.tokenUrl, params)
  }

  // Получение информации о пользователе
  getUserInfo() {

  }

}
