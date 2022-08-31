import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterpipe',
})
export class FilterpipePipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (!arg) {
      return value;
    } else {
      arg = arg.toLowerCase();

      return value.filter(function (item: any) {
        return JSON.stringify(item.name).toLowerCase().includes(arg);
      });
    }
  }
}
