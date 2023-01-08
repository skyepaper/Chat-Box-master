import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { IMessage } from '../interface/message';
import { IPostbox } from '../interface/postbox';
import { IUser } from '../interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})

export class NavComponent {
  
  public user:IUser|null=null;
  public users:IUser[]=[];
  public allPost:IPostbox[]=[];
  public messages:IMessage[]=[];

postboxFlag:number=0;
passUsers:string='';

passMessages:string='';
passPostbox:string='';

public postbox:IPostbox[]=[];

constructor(private dialog: MatDialog,private router:Router,private http:HttpClient) {}
ngOnInit(): void {
  
  this.loadData();
}
loadData(){
  var interval=setInterval(()=>{
    this.loadUsers();
    this.loadMessages();
    this.loadPostbox();
    this.checkNewMessages();
    this.getUser();
    
    this.passUsers=JSON.stringify(this.users);
    var cypher=crypto.AES.encrypt(this.passUsers,'key');
    localStorage.setItem('passUsers',cypher.toString());
    
    this.passMessages=JSON.stringify(this.messages);
    var cypher2=crypto.AES.encrypt(this.passMessages,'key');
    localStorage.setItem('passMessages',cypher2.toString());

    this.passPostbox=JSON.stringify(this.allPost);
    var cypher3=crypto.AES.encrypt(this.passPostbox,'key');
    localStorage.setItem('passPostbox',cypher3.toString());

   // console.log(`--load data--`);
  },5000);
}
loadUsers(){
  this.http.get<IUser[]>('https://63af5f75649c73f572baa737.mockapi.io/users')
  .subscribe({
    next:(value)=>{
      this.users=value;
    }});
   }
loadMessages(){
  this.http.get<IMessage[]>('https://63af5f75649c73f572baa737.mockapi.io/messages')
  .subscribe({
    next:(value)=>{
      this.messages=value;
    }});
   }
loadPostbox(){
  this.http.get<IPostbox[]>('https://63af5f75649c73f572baa737.mockapi.io/postbox')
  .subscribe({
    next:(value)=>{
      this.allPost=value;
    }});
   }

checkNewMessages(){
  this.postbox=this.allPost.filter(p=>p.receiver==this.user?.username);
 
    if(this.postbox.length>0)this.postboxFlag=1;
    if(this.postbox.length==0)this.postboxFlag=0;
 
}
getUser(){
  if(localStorage.getItem('user')){
    this.user=JSON.parse(localStorage.getItem('user')!);
  }
}

openLogin() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;

    this.dialog.open(LoginComponent,dialogConfig);
}
openRegister() { 

  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.hasBackdrop=true;
  dialogConfig.closeOnNavigation=false;

  this.dialog.open(RegisterComponent,dialogConfig);
}
logout(){
  localStorage.clear();
  this.user=null;
  this.router.navigate(['/wall']);
}

}
