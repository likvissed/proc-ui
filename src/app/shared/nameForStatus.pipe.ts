import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "nameForStatus"
})
export class NameForStatusPipe implements PipeTransform {
  transform(number: number): any {
    switch (number) {
      case 0:
        return "<span class='badge badge-info'> Новая </span>";
      case 1:
        return "<span class='badge badge-success'> Действующая </span>";
      case 2:
        return "<span class='badge badge-warning'> Просроченная </span>";
      case 3:
        return "<span class='badge badge-danger'> Отклонённая </span>";
      case 4:
        return "<span class='badge badge-secondary'> Отозванная </span>";
      case 5:
        return "<span class='badge badge-primary'> Согласованная </span>";
      default:
        return "<span class='badge badge-light'> Неизвестный </span>";
    }

  }
}
