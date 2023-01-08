import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IPostbox } from '../interface/postbox';
import { IUser } from '../interface/user';

@Component({
  selector: 'app-friend-request',
  templateUrl: './friend-request.component.html',
  styleUrls: ['./friend-request.component.css']
})
export class FriendRequestComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: string,private http:HttpClient) { }
  messageSendFlag=0;
  
  date!: Date;
  dateString:string="";
  locale:string='en-US';
  message:string|null="";
  public user:IUser|null=null;
  

  ngOnInit(): void {
    this.date=new Date();
  this.dateString=formatDate(this.date,'d MMM - h:mm a',this.locale);
  }
  
  sendFriendRequest(){
    this.messageSendFlag=0;
    
    let request=<IPostbox>{
      sender: this.getUsername(),
      receiver: this.data,
      message:this.message,
      friendRequest:'true',
      date:this.date,
      dateStr:this.dateString
    }
  if(this.message){
    this.http.post<IPostbox>('https://63af5f75649c73f572baa737.mockapi.io/postbox',request).subscribe();
  }
  this.messageSendFlag=1;
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
