import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: string): unknown {
    return marked.parse(value.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "")
    );
  }

}
