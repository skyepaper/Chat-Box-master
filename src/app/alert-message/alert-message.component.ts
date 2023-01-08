import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IUser } from '../interface/user';

@Component({
  selector: 'app-alert-message',
  templateUrl: './alert-message.component.html',
  styleUrls: ['./alert-message.component.css']
})
export class AlertMessageComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string[],private http:HttpClient) { }
  
  message:string=this.data[2];
  getUsersFlag:number=0;

  public user:IUser|null=null;
  public userSec:IUser|null=null;
  public users:IUser[]=[];

  ngOnInit(): void {
    this.getUser();
    this.getUsers();
    
  }
  acceptAsFriend(){
    
    var interval=setInterval(()=>{
    if(this.getUsersFlag==1){

      this.userSec=this.users.find(u=>u.username===this.data[1])!;

      if(!this.user?.friends.includes(this.userSec.username)){
          this.user?.friends.push(this.userSec.username);
      }
      if(!this.userSec?.friends.includes(this.user!.username)){
        this.userSec?.friends.push(this.user!.username);
      }
      if(this.userSec!==null){
        this.getUsersFlag=2;
        clearInterval(interval);
      }
      
    }
    
    if(this.getUsersFlag==2){
      this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.user?.id}`,this.user).subscribe({
        next:(value)=>{
          this.user=value;
        }});
      this.http.put<IUser>(`https://63af5f75649c73f572baa737.mockapi.io/users/${this.userSec?.id}`,this.userSec).subscribe({
        next:(value)=>{
          this.userSec=value;
        }});
        this.getUsersFlag=1;
        localStorage.setItem('user',JSON.stringify(this.user));
    }
    },1000);

   
     
  }
  getUsers(){
    var interval=setInterval(()=>{
    this.http.get<IUser[]>('https://63af5f75649c73f572baa737.mockapi.io/users')
     .subscribe({
       next:(value)=>{
         this.users=value;
       }});
      
       if(this.users.length>0){
        this.getUsersFlag=1;

        clearInterval(interval);
       }
       
      },1000);

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
}
