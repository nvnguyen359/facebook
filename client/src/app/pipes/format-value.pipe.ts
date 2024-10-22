import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatValue',
  standalone: true,
})
export class FormatValuePipe implements PipeTransform {
  transform(value: any): string {
    if (value == undefined) return value;
    const pattern = /^[A-Za-z]/g;
    if (pattern.test(`${value}`)) {
      return value;
    }
    if (typeof value == 'string') {
      return `${value}`;
    }
    if (typeof value == 'number') {
      return value.toLocaleString('vi');
    }
    if (`${value}`.includes('%')) return `${value}`;
    if (value instanceof Date) {
      return new Date(value).toLocaleDateString('vi');
    } else {
      return `${value}`;
    }
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
  isValidDate(d: any) {
    return d instanceof Date;
  }
}
