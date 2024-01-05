import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitByCapital'
})
export class SplitByCapitalPipe implements PipeTransform {

  transform(value: string): string {
    let match = value.match(/[A-Z][a-z]+|[0-9]+/g);
    if (match) {
      return match.join(" ");
    }
    return value;
  }

}
