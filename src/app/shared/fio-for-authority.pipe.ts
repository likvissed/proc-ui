import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fioForAuthority'
})
export class FioForAuthorityPipe implements PipeTransform {
  transform(data): string {
    if (data.length) {
      return data.map(e => e.fio).join(', ')
    }

    return 'Для всех';
  }
}
