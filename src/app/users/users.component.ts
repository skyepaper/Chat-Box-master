import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loadFlag:number=1;
  constructor() { }

  ngOnInit(): void {
    
    setTimeout(()=>{this.loadFlag=1;},3000);
  }
  
}
