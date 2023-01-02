import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IMessage } from '../interface/message';
import { IUser } from '../interface/user';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css']
})
export class WallComponent implements OnInit {

  constructor(private http:HttpClient) { }

  date!: Date;
  ngOnInit(): void {
    this.date=new Date();
  }
  public user:IUser|null=null;
  timeLeft:number=0;
  message:string|null="";
  messageLength:number=0;
 

  postMessage(){
   
    
    let messageToPost=<IMessage>{
      sender: this.getUsername(),
      receiver: 'wall',
      message:this.message,
      date:this.date
    }
  if(this.message){
    this.http.post<IMessage>('https://63af5f75649c73f572baa737.mockapi.io/messages',messageToPost).subscribe();

    console.log(messageToPost);
  }

  this.message="";
  this.timeLeft=10;
  this.startTimer();
  }
  startTimer(){
  var interval=setInterval(() => {
    if(this.timeLeft>0)this.timeLeft--;
    else clearInterval(interval);
  },1000);
}
getUsername(){
  if(localStorage.getItem('user')){
    this.user=JSON.parse(localStorage.getItem('user')!);
    this.user=JSON.parse(localStorage.getItem('user')!);

    return this.user?.username;
  }
  return "anon";
 }
}
