import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { getSafePropertyAccessString } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { IPostbox } from '../interface/postbox';
import { IUser } from '../interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {

  constructor(private http:HttpClient,private dialog: MatDialog,private router:Router) { }
  loaderFlag:number=0;

  public allPost:IPostbox[]=[];
  public userPost:IPostbox[]=[];
  public user:IUser|null=null;
  

  ngOnInit(): void {
   this.reloadPage();
  }


  getUser(){
    this.user=JSON.parse(localStorage.getItem('user')!);
}
  
  acceptFriendRequest(username:string,message:string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;
    dialogConfig.data=['acceptFriend',username,message]

    this.dialog.open(AlertMessageComponent,dialogConfig);
  }
  deleteMessage(id:number){
    this.http.delete<IPostbox>(`https://63af5f75649c73f572baa737.mockapi.io/postbox/${id}`).subscribe();
  }
  clearMail(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;
    dialogConfig.data=['clearMail']

    this.dialog.open(AlertMessageComponent,dialogConfig);

  }
  reloadPage(){
    var interval=setInterval(()=>{
      this.getUser();
      if(this.userPost.length==0)this.loaderFlag=0;
      
      var cypher=localStorage.getItem('passPostbox');
      var cypherDe=crypto.AES.decrypt(cypher!,'key');
      this.allPost=JSON.parse(cypherDe.toString(crypto.enc.Utf8));
  
    this.userPost=this.allPost.filter(u=>u.receiver==this.user?.username);
    if(this.userPost.length>0)this.loaderFlag=1;

    //  console.log('post-user-list');
    },2000);
  }
  navigateProfile(username:string){
    localStorage.setItem('navigate',username);
    this.router.navigate(['/profile']);
  }
}
