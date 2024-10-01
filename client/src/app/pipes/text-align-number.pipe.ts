import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textAlignNumber',
  standalone: true,
})
export class TextAlignNumberPipe implements PipeTransform {
  transform(value: any, dataField: string = ''): string {

    if (Array.isArray(value)) {
      value = Array.from(value)[0][dataField];
    }
    if (`${value}`.includes('%')) {
      
      return 'text-right';
    } else {
      const t =
        this.isNumeric(value) || dataField.includes('pay')
          ? 'text-right'
          : 'text-left';
      return t;
    }
  }
  isNumeric(str: any) {
    return /^-?\d+$/.test(str);
  }
}
