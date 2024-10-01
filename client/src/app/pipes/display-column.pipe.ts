import { Pipe, PipeTransform } from '@angular/core';
import { adcolumnsToDisplay } from '../general';

@Pipe({
  name: 'displayColumn',
  standalone: true,
})
export class DisplayColumnPipe implements PipeTransform {
  transform(value: string): string {
    const t = adcolumnsToDisplay.find((x) => x['key'] == value);
    return t ? t.value : value;
  }
}
