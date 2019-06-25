import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CourseService } from './../../shared/sharedservices/course.service';
import { UserService } from './../../shared/sharedservices/user.service';



@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  providers: [UserService, CourseService]
})
export class MygroupsComponent implements OnInit {

  identiti: any;
  token: any;
  cursoslist: any[] = [];
  cursosinactive: any[] = [];
  cursosnext: any[] = [];
  loading = false;
  messageNewUser = false;

  constructor(private router: Router, private user: UserService, private course: CourseService) {
    this.identiti = this.user.getIdentiti();
    this.token = this.user.getToken();
  }

  ngOnInit() {
    this.loading = true;
    this.identiti = this.user.getIdentiti();
    this.getCourseUser();
  }

  getCourseUser() {
    this.course.getCourses(this.token).subscribe(data => {
      const mycursos = data.message.groups;
      this.course.getCoursesOrg().subscribe( res => {
        for (const idcr of res.message.courses) {
          for (const idmg of mycursos) {
            if (idcr.id === idmg.courseid ) {
              if (idmg.status === 'active') {
                this.cursoslist.push({
                  curso: idmg,
                  imagen: idcr.image
                });
              } else if (idmg.status === 'closed') {
                this.cursosinactive.push({
                  curso: idmg,
                  imagen: idcr.image
                });
              } else if (idmg.status === 'coming') {
                this.cursosnext.push({
                  curso: idmg,
                  imagen: idcr.image
                });
              }
            }
          }
        }
      });
      this.messageNewUser = false;
      this.loading = false;
    }, error => {
      if (error._body.includes('"message":"No groups found"')) {

      }
      this.messageNewUser = error._body.includes('"message":"No groups found"');
      this.loading = false;
    });
  }

  /*
  Metodo para redireccionar al usuario al curso que selecciono
  */
  public getMycourse(course: string, groupid: string, courseid: string, lastSeenBlock: string, firstBlock: string) {
    if (!lastSeenBlock) {
      this.router.navigate(['/user/mycourses', course, groupid, courseid, firstBlock]);
    } else {
      this.router.navigate(['/user/mycourses', course, groupid, courseid, lastSeenBlock]);
    }
  }
}
