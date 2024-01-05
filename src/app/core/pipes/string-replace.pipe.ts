import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringReplace'
})
export class StringReplacePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
