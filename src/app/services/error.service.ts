import { Injectable, Input } from "@angular/core";
import { NotificationService } from "./notification.service";
import { AuthHelper } from '@iss/ng-auth-center';

@Injectable({providedIn: 'root'})

export class ErrorService {
  constructor(
    private notification: NotificationService,
    private authHelper: AuthHelper
  ) {}

  handling(response) {
    switch (response.status) {
      case 401: // Авторизация
          this.notification.show('Авторизуйтесь снова', { classname: 'bg-warning', headertext: 'Не авторизован' });
          this.authHelper.logout();
          break;
      case 403: // Доступа нет
          this.notification.show('Доступ запрещён', { classname: 'bg-danger text-light' });
          break;
      case 422: // Ошибки с сервера
        this.notification.show(response.error.error_description, { classname: 'bg-danger text-light', headertext: 'Внимание' });
        break;
      default: // Неизвестные ошибки
        console.error(response)

        this.notification.show('Сервер временно недоступен', { classname: 'bg-danger text-light', headertext: `Ошибка ${response.status}` });
        break;
    }
  }

}
