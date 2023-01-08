import { throwDialogContentAlreadyAttachedError } from '@angular/cdk/dialog';
import { HttpClient } from '@angular/common/http';
import { getSafePropertyAccessString } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertMessageComponent } from '../alert-message/alert-message.component';
import { IPostbox } from '../interface/postbox';
import { IUser } from '../interface/user';

//import { postboxFlag } from '../../app/nav/nav.component';

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
    this.getUsername();
    this.loaderFlag=0;
    this.reloadPage();

    var interval=setInterval(()=>{
      if(this.userPost.length==0)this.loaderFlag=0;
      this.reloadPage();
    },5000);
  }
  getPost(){ 
    this.http.get<IPostbox[]>('https://63af5f75649c73f572baa737.mockapi.io/postbox')
    .subscribe({
      next:(value)=>{
        this.allPost=value;
      }});
if(this.allPost.length>0)
    this.userPost=this.allPost.filter(p=>p.receiver==this.user?.username);
    
  }
  getUsername(){
    if(localStorage.getItem('user')){
      this.user=JSON.parse(localStorage.getItem('user')!);
  
      return this.user?.username;
    }
    return "anon";
  }
  reloadPage(){
    this.allPost=[];

    var interval=setInterval(()=>{
      if(this.userPost.length==0){
        this.getPost();
        if(this.allPost.length>0){
          clearInterval(interval);
        //  this.router.navigate(['/wall']);
        }
      }
    else {
      this.loaderFlag=1;

      clearInterval(interval);
    }
  },5000);
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
    this.http.delete<IPostbox[]>(`https://63af5f75649c73f572baa737.mockapi.io/postbox/${id}`).subscribe();
    this.userPost=[];
    this.loaderFlag=0;
    this.reloadPage();
  }

}
