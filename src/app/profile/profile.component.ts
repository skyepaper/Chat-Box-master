import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { IMessage } from '../interface/message';
import { IUser } from '../interface/user';

import * as crypto from 'crypto-js';
import { IPostbox } from '../interface/postbox';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user:IUser|undefined;
  imageFlag:number=0;
  friends:string[]=[];
  newUrl:string='';

  loaderFlag:number=0;
  
  date:string="";
  
  userSec:string='';
  public messages:IMessage[]=[];
  public messagesToPublish:IMessage[]=[];
  public messagesToPublishShow:IMessage[]=[];

  timeLeft:number=0;
  message:string|null="";
  messageLength:number=0;
  numMessagesToShow:number=0;
  //stopLoadingFlag:number=0;

  constructor(private http:HttpClient,private dialog: MatDialog) { }

  ngOnInit(): void {
  
   this.getUser();
   this.reloadPage();

  }
 
  getUser(){
    this.user=JSON.parse(localStorage.getItem('user')!);
    this.friends=this.user?.friends!;
   }
  
   changeImage(){
    this.imageFlag=1;
   }
   saveImage(){
    let editUser=<IUser>{
      id:this.user?.id!,
      username: this.user?.username!,
      password: this.user?.password!,
      image:this.newUrl,
      friends:this.user?.friends!,
     
     }
  
      this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.user?.id}`,editUser).subscribe({
        next:(value)=>{
          this.user=value;
        }});
       
      localStorage.setItem('user',JSON.stringify(editUser));
      this.imageFlag=0;
      this.newUrl='';
   }
   loadChat(username:string,numMessage:number){
    this.numMessagesToShow=numMessage;
    if(this.userSec!==username)this.userSec=username;
    
   //if(this.userSec)localStorage.removeItem('navigate');
    let interval=setInterval(()=>{
    
    this.messagesToPublish=this.messages.filter
    (m=>(m.sender==this.user?.username && m.receiver==username) || (m.sender==username && m.receiver==this.user?.username));
    
  let numShowStrong:number=0;
  if(this.numMessagesToShow>this.messagesToPublish.length)numShowStrong=this.messagesToPublish.length;
  else numShowStrong=this.numMessagesToShow;
 
  this.messagesToPublishShow=this.messagesToPublish.slice(-numShowStrong);
 
  //localStorage.removeItem('navigate');

  if(this.userSec!==username){
   // this.stopLoadingFlag=1;
    clearInterval(interval);
  }
  
  if(this.messagesToPublish.length>0){
    this.loaderFlag=2;
    clearInterval(interval);
  }

  if(this.messagesToPublish.length==0 || !this.user){
    this.loaderFlag=2;
    clearInterval(interval);
  }

},2000);

   }
  
  showMore(){
    if(this.numMessagesToShow<this.messagesToPublish.length){
      this.numMessagesToShow+=6;
      this.loadChat(this.userSec,this.numMessagesToShow);
    }
  }
  postMessage(){
    this.date=formatDate(new Date(),'d MMM - h:mm a','en-US');

    let messageToPost=<IMessage>{
      sender: this.user?.username,
      receiver: this.userSec,
      message:this.message,
      date:this.date
    }
    let newMessage=<IPostbox>{
      sender: this.user?.username,
      receiver: this.userSec,
      message:'',
      friendRequest:'false',
      date:this.date
    }
  if(this.message && this.userSec){
    this.http.post<IMessage>('https://63af5f75649c73f572baa737.mockapi.io/messages',messageToPost).subscribe();
    this.http.post<IPostbox>('https://63af5f75649c73f572baa737.mockapi.io/postbox',newMessage).subscribe();
  }

  this.message="";
  this.timeLeft=10;
  this.startTimer();
  
 
  }
  startTimer(){
    var interval=setInterval(() => {
      if(this.timeLeft>0)this.timeLeft--;
      else clearInterval(interval);
    },600);
    }
  removeUser(username:string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;
    dialogConfig.data=['removeUser',username]

    this.dialog.open(AlertMessageComponent,dialogConfig);
  }
  reloadPage(){
    let flag=0;
    let interval=setInterval(()=>{
      this.getUser();

      if(localStorage.getItem('navigate') && flag==0){
        this.userSec=localStorage.getItem('navigate')!;
        flag=1;
      }
      
      var cypher=localStorage.getItem('passMessages');
      var cypherDe=crypto.AES.decrypt(cypher!,'key');
      this.messages=JSON.parse(cypherDe.toString(crypto.enc.Utf8));

     // if(this.userSec)
      this.loadChat(this.userSec,this.numMessagesToShow);
   
    /*  if(this.stopLoadingFlag==1 || !this.user){
        this.stopLoadingFlag=0;
        clearInterval(interval);
      }*/
      
    },2000);
  }
 
}
