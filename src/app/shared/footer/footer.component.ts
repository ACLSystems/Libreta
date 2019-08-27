import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {

	public year:number;
	public versionT:string;
  constructor() { }

  ngOnInit() {
		let now = new Date();
		this.year = now.getFullYear();
  }

}
