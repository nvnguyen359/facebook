import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slidePipe',
  standalone: true,
})
export class SlidePipe implements PipeTransform {
  transform(value: any): boolean {
    return value==1 ;
  }
}
