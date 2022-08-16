import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterpipe',
})
export class FilterpipePipe implements PipeTransform {
  transform(value: any, arg: any): any {
    if (!arg[0]) {
      return value;
    } else if (arg[1] === 'domain') {
      return value.filter(function (item: any) {
        return JSON.stringify(item).toLowerCase().includes(arg[0]);
      });
    }
  }
}
