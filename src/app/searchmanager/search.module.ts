import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchstudentComponent } from './searchstudent/searchstudent.component';
import { SearchconsoleComponent } from './searchconsole/searchconsole.component';

import { SearchroutingModule } from './search.router';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    SearchroutingModule
  ],
  declarations: [SearchstudentComponent, SearchconsoleComponent]
})
export class SearchModule { }
