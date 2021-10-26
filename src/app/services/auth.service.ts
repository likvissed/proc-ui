import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })

export class AuthService {
  constructor(
    private http: HttpClient
  ) {}

  // Проверка: авторизован ли пользователь
  isAuthenticated(): boolean {
    console.log('user_lk', localStorage.getItem('user_lk'))

    return localStorage.getItem('user_lk') ? true : false
  }

  login() {
    // let user = sessionStorage.getItem('user_lk')
    // console.log('login', !(user === null))
    // return !(user === null)
  }

  logout() {
    localStorage.removeItem('user_lk')
  }
}
