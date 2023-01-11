import { _isNumberValue } from '@angular/cdk/coercion';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FriendRequestComponent } from '../friendRequest/friend-request.component';
import { IMessage } from '../interface/message';
import { IUser } from '../interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loaderFlag:number=0;

  public users:IUser[]=[];
  public usersToShow:IUser[]=[];
  public messages:IMessage[]=[];
  curUser:IUser|null=null;

  constructor(private http:HttpClient,private dialog: MatDialog,private router:Router) { }

  ngOnInit(): void {
    this.reloadPage();
  }
 
  getPostCount(username:string){
    let posts=this.messages.filter(a=>a.sender==username);
    return posts.length;
  }
  getUser(){
   
      this.curUser=JSON.parse(localStorage.getItem('user')!);
   
  }

  checkFriend(username:string){
    if(this.curUser){
      let friends=this.curUser.friends.filter(f=>f==username);
      if(friends.length>0)return true;
    }
   return false;
  }
  makeFriendRequest(username:string){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;
    dialogConfig.data=username;

    this.dialog.open(FriendRequestComponent,dialogConfig);
  }
  reloadPage(){
    var interval=setInterval(()=>{
      this.getUser();
      if(this.usersToShow.length==0)this.loaderFlag=0;
      
      var cypher=localStorage.getItem('passUsers');
      var cypherDe=crypto.AES.decrypt(cypher!,'key');
      this.users=JSON.parse(cypherDe.toString(crypto.enc.Utf8));

      var cypher2=localStorage.getItem('passMessages');
      var cypherDe=crypto.AES.decrypt(cypher2!,'key');
      this.messages=JSON.parse(cypherDe.toString(crypto.enc.Utf8));
  
    this.usersToShow=this.users.filter(u=>u.username!=this.curUser?.username);
    if(this.usersToShow.length>0)this.loaderFlag=1;

    //  console.log('post-user-list');
    },2000);
  }
  navigateProfile(username:string){
    localStorage.setItem('navigate',username);
    this.router.navigate(['/profile']);
  }
}
