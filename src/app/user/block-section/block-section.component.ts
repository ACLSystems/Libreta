import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-block-section',
  templateUrl: './block-section.component.html'
})
export class BlockSectionComponent implements OnInit {

  @Input() block:any;

  constructor() {
  }

  ngOnInit() {
    this.getBlock(this.block);
  }

  getBlock(data:any){
    
  }
}
