import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValue', standalone: true,
})
export class FormatValuePipe implements PipeTransform {

  transform(value: string): string {
    if (value == undefined) return value;
  
    if (this.isNumeric(value)) {
      return parseInt(value).toLocaleString('vi');
    } else {
      if(`${value}`.includes('%')) return value;
      if (new Date(value).toString() != "Invalid Date") {
        return new Date(value).toLocaleDateString("vi");
      } else {
        return value;
      }
    }
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  isValidDate(d: any) {
    return d instanceof Date;
  }
}
