import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { Router } from '@angular/router';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';
import { IUser } from '../interface/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

public user:IUser|null=null;

constructor(private dialog: MatDialog,private router:Router) {}

getUsername(){
  if(localStorage.getItem('user')){
    this.user=JSON.parse(localStorage.getItem('user')!);
    this.user=JSON.parse(localStorage.getItem('user')!);

    return this.user?.username;
  }
  return "anon";
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
