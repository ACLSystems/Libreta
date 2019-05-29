import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nabvar',
  templateUrl: './nabvar.component.html'
})
export class NabvarComponent implements OnInit {
  environment: any;
  constructor() { }

  ngOnInit() {
    this.environment = environment.production;
  }

}
