import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterpipe'
})
export class FilterpipePipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    // return items.filter(function(item:any){
    //   return JSON.stringify(item).toLowerCase().includes(searchText);
    // });
    searchText = searchText.toLocaleLowerCase();

    return items.filter(it => {
      return it.domainName.toLocaleLowerCase().includes(searchText);
    });
  }

}
