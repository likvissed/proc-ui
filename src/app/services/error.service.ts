import { Injectable, Input } from "@angular/core";
import { NotificationService } from "./notification.service";

@Injectable({providedIn: 'root'})

export class ErrorService {
  constructor(
    private notification: NotificationService
  ) {}

  handling(response) {
    switch (response.status) {
      case 403:
          this.notification.show(response.error.error_description, { classname: 'bg-warning', headertext: 'Внимание'});
          break;
      case 422:
        this.notification.show(response.error.error_description, { classname: 'bg-danger text-light'});
        break;
      default:
        console.error(response)

        this.notification.show('Сервер временно недоступен', { classname: 'bg-danger text-light', headertext: `Ошибка ${response.status}`});
        break;
    }
  }

}
