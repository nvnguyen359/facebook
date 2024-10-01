import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberRound",
})
export class NumberRoundPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    const nFormat = new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 3 });
    return `${value}`.length > 6
      ? `${nFormat.format(Math.round((value / 1000000+ Number.EPSILON)*100)/100)}m`
      : `${value}`.length>3
      ? `${nFormat.format(Math.round((value / 1000 + Number.EPSILON)*100)/100)}k`
      : `${value}`;
  }
}
