import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { IMessage } from '../interface/message';
import { IUser } from '../interface/user';

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
  date!: Date;
  dateString:string="";
  locale:string='en-US';
  
  userSec:string='';
  public messages:IMessage[]=[];
  public messagesToPublish:IMessage[]=[];
  public messagesToPublishShow:IMessage[]=[];

  timeLeft:number=0;
  message:string|null="";
  messageLength:number=0;
  numMessagesToShow:number=0;
  stopLoadingFlag:number=0;

  constructor(private http:HttpClient,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.date=new Date();
    this.dateString=formatDate(this.date,'d MMM - h:mm a',this.locale);
    
    this.getUser();
    this.numMessagesToShow=6;

    this.getMessages();
    let interval=setInterval(()=>{

      this.getMessages();
      this.getUser();
      if(this.userSec)this.loadChat(this.userSec,this.numMessagesToShow);
      if(this.stopLoadingFlag==1 || !this.user){
        this.stopLoadingFlag=0;
        clearInterval(interval);
      }
      
    },10000);

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

    let interval=setInterval(()=>{
    this.userSec=username;
    this.messagesToPublish=this.messages.filter
    (m=>(m.sender==this.user?.username && m.receiver==username) || (m.sender==username && m.receiver==this.user?.username));
    
  let numShowStrong:number=0;
  if(this.numMessagesToShow>this.messagesToPublish.length)numShowStrong=this.messagesToPublish.length;
  else numShowStrong=this.numMessagesToShow;
 
  this.messagesToPublishShow=this.messagesToPublish.slice(-numShowStrong);
  console.log(this.messagesToPublish);
  
  if(this.userSec!==username){
    this.stopLoadingFlag=1;
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

 
},1000);

   }
   getMessages(){
    let interval=setInterval(()=>{
      
    this.http.get<IMessage[]>('https://63af5f75649c73f572baa737.mockapi.io/messages')
    .subscribe({
      next:(value)=>{
        this.messages=value;
      }});

      if(this.messages.length>0)clearInterval(interval);
    },1000);

  }
  showMore(){
    if(this.numMessagesToShow<this.messagesToPublish.length){
      this.numMessagesToShow+=6;
      this.loadChat(this.userSec,this.numMessagesToShow);
    }
  }
  postMessage(){
    let messageToPost=<IMessage>{
      sender: this.user?.username,
      receiver: this.userSec,
      message:this.message,
      date:this.dateString
    }
  if(this.message && this.userSec){
    this.http.post<IMessage>('https://63af5f75649c73f572baa737.mockapi.io/messages',messageToPost).subscribe();
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
  getUsername(){
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user')!);
      this.user=JSON.parse(localStorage.getItem('user')!);
  
      return this.user?.username;
    }
    return "anon";
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
}
