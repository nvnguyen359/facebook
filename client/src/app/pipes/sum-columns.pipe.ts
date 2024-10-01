import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumColumns',
  standalone: true,
})
export class SumColumnsPipe implements PipeTransform {
  transform(column: string, array: any[]): any {
    if (column == 'no') {
      return 'Tổng';
    }
    if (column.includes('At') || column.includes('price')) {
      return '';
    } else {
      const maps = array
        .filter((x) => x[column] != null && this.isNumber(x[column]))
        .map((x) => x[column]);
      return maps.length > 0 ? maps.reduce((a, b) => a + b, 0) : '';
    }
  }
  isNumber(value: any) {
    return typeof value === 'number';
  }
}
