import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "shortName"
})
export class ShortNamePipe implements PipeTransform {
  transform(fullName: string): any {
    return fullName
      .split(" ")
      .map((el, index) => {
        return index == 0 ? `${el} ` : `${el[0]}.`
      })
      .join("");
  }
}
