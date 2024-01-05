import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineBreakReplace'
})
export class LineBreakReplacePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\n/g, '<br>');
  }

}
