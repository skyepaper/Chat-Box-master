import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  loadFlag:number=0;
  constructor() { }

  ngOnInit(): void {
    setTimeout(()=>{this.loadFlag=1;},2000);
  }

}
