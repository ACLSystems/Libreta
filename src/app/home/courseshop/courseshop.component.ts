import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courseshop',
  templateUrl: './courseshop.component.html'
})
export class CourseshopComponent implements OnInit {

  courseShop: any[] = [];
  messageUser = null;

  constructor() { }

  ngOnInit() {

  }

  public setShopCourses( courseid: any, members: number) {
    console.log( this.courseShop );
    if ( this.courseShop.length > 0 ) {
      if ( this.courseShop.find(idcs => idcs.curso === courseid) ) {
        this.messageUser = 'Ya has agregado este curso a la lista';
      } else {
        this.courseShop.push({
          curso: courseid,
          member: members
        });
      }
    } else {
      this.courseShop.push({
        curso: courseid,
        member: members
      });
    }
    console.log( this.courseShop );
  }
}
