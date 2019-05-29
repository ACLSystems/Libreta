import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'videos'
})
export class VideosPipe implements PipeTransform {

  constructor(private dms:DomSanitizer){

  }
  transform(value: string): any {
    return this.dms.bypassSecurityTrustResourceUrl(value);
  }

}
