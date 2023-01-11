import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ActivatedRoute, Router } from '@angular/router';
import { IPostbox } from '../interface/postbox';
import { IUser } from '../interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string[],private http:HttpClient,private router:Router) { }
  
  message:string=this.data[2];
  getUsersFlag:number=0;

  public user:IUser|null=null;
  public userSec:IUser|null=null;
  public users:IUser[]=[];

  public allPost:IPostbox[]=[];
  public userPost:IPostbox[]=[];

  ngOnInit(): void {
    this.getUser();
    this.getUsers();
    
  }
  acceptAsFriend(){
    
    var interval=setInterval(()=>{
    if(this.getUsersFlag==0){

      this.userSec=this.users.find(u=>u.username===this.data[1])!;

      if(!this.user?.friends.includes(this.userSec.username)){
          this.user?.friends.push(this.userSec.username);
      }
      if(!this.userSec?.friends.includes(this.user!.username)){
        this.userSec?.friends.push(this.user!.username);
      }
      if(this.userSec!==null){
        this.getUsersFlag=1;
      }
      
    }
    
    if(this.getUsersFlag==1){
     
      this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.user?.id}`,this.user).subscribe({
        next:(value)=>{
          this.user=value;
        }});
      this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.userSec?.id}`,this.userSec).subscribe({
        next:(value)=>{
          this.userSec=value;
        }});
        this.getUsersFlag=0;
        localStorage.setItem('user',JSON.stringify(this.user));
        clearInterval(interval);
    }
    },2000);

   
     
  }
  getUsers(){
    var cypher=localStorage.getItem('passUsers');
      var cypherDe=crypto.AES.decrypt(cypher!,'key');
      this.users=JSON.parse(cypherDe.toString(crypto.enc.Utf8));
      }
  getUser(){
        this.user=JSON.parse(localStorage.getItem('user')!);
      }
  removeFriend(){
   
    let friends=this.user?.friends.filter(f=>f!==this.data[1]);
  
    let userNew=<IUser>{
      username:this.user?.username,
      password:this.user?.password,
      image:this.user?.image,
      friends:friends,
    }

    this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.user?.id}`,userNew).subscribe({
        next:(value)=>{
          this.user=value;
        }});
    localStorage.setItem('user',JSON.stringify(userNew));
    this.getUser();
  }
  clearAllMail(){
    this.getUser();
    var interval=setInterval(()=>{

      var cypher=localStorage.getItem('passPostbox');
      var cypherDe=crypto.AES.decrypt(cypher!,'key');
      this.allPost=JSON.parse(cypherDe.toString(crypto.enc.Utf8));
  
    this.userPost=this.allPost.filter(u=>u.receiver==this.user?.username);

    for(let i=0;i<this.userPost.length;i++){
        this.http.delete<IPostbox>(`https://63af5f75649c73f572baa737.mockapi.io/postbox/${this.userPost[i].id}`).subscribe();
    }
    if(this.userPost.length==0){
      this.router.navigate(['/wall']);
      clearInterval(interval);
    }

  },2000);

  }
}
