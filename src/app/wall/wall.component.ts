import { DatePipe, formatDate } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { IMessage } from '../interface/message';
import { IUser } from '../interface/user';
import { NavComponent } from '../nav/nav.component';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.css'],
})
export class WallComponent implements OnInit {

  constructor(private http:HttpClient) { }

  loaderFlag:number=0;

  public messages:IMessage[]=[];
  public user:IUser|null=null;

  public messagesToPublish:IMessage[]=[];
  public messagesToPublishShow:IMessage[]=[];
  public messagesLeft:IMessage[]=[];
  public messagesRight:IMessage[]=[];

  timeLeft:number=0;
  message:string|null="";
  numMessagesToShow:number=0;

  ngOnInit(): void {
    this.numMessagesToShow=6;
    this.postMessagesOnWall();
  }
getUser(){
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user')!);
    }
  }

startTimer(){
    var interval=setInterval(() => {
      if(this.timeLeft>0)this.timeLeft--;
      else clearInterval(interval);
    },600);
    }
showMore(){
      if(this.numMessagesToShow<this.messagesToPublish.length){
        this.numMessagesToShow+=6;
      }
    }
postMessage(){
    let dateString=formatDate(new Date(),'d MMM - h:mm a','en-US');

    let messageToPost=<IMessage>{
      sender: this.user?.username || 'anon',
      receiver: 'wall',
      message:this.message,
      date:dateString
    }
  if(this.message){
    this.http.post<IMessage>('https://63af5f75649c73f572baa737.mockapi.io/messages',messageToPost).subscribe();
  }

  this.message="";
  this.timeLeft=10;
  this.startTimer();

  }
postMessagesOnWall(){
  var interval=setInterval(()=>{
  this.getUser();
  if(this.messagesToPublish.length==0)this.loaderFlag=0;

    var cypher=localStorage.getItem('passMessages');
    var cypherDe=crypto.AES.decrypt(cypher!,'key');
    this.messages=JSON.parse(cypherDe.toString(crypto.enc.Utf8));

  this.messagesToPublish=this.messages.filter(m=>m.receiver=='wall');
  if(this.messagesToPublish.length>0)this.loaderFlag=1;

  let numShowStrong:number=0;
  if(this.numMessagesToShow>this.messagesToPublish.length)numShowStrong=this.messagesToPublish.length;
  else numShowStrong=this.numMessagesToShow;
 
  this.messagesToPublishShow=this.messagesToPublish.slice(-numShowStrong);
  
  this.messagesLeft=[];
  this.messagesRight=[];

  if(this.messagesToPublishShow.length>0){
    for(let i=0;i<this.messagesToPublishShow.length;i++){
          if(i%2==0){
             this.messagesLeft.push(this.messagesToPublishShow[i]);
             this.loaderFlag=1;
            }
          else  this.messagesRight.push(this.messagesToPublishShow[i]);
       }
   }
 //  console.log('post-on-wall');
  },2000);
  }
  
}
