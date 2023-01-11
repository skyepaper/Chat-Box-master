import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { RegisterComponent } from '../register/register.component';
import { IUser } from 'src/app/interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


  export class LoginComponent {
    constructor(private dialog: MatDialog,private router:Router,private http:HttpClient) {}
    ngOnInit(): void {
      this.getUsers();
      this.errorMessage='';
    }

  public errorMessage:string='';
  public tickValue=true;
    
    loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl(''),
    });

    openRegister() {

      const dialogConfig = new MatDialogConfig();
    
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.hasBackdrop=true;
      dialogConfig.closeOnNavigation=false;
    
      this.dialog.open(RegisterComponent,dialogConfig);
    }
    users:IUser[]|null=null;


  async getUsers(){
    var cypher=localStorage.getItem('passUsers');
    var cypherDe=crypto.AES.decrypt(cypher!,'key');
    this.users=JSON.parse(cypherDe.toString(crypto.enc.Utf8));
    }

  checkError(user:IUser){
    if(!(user.username && user.password)){
      this.errorMessage='All fields required';
      return;
    }
    if(user.username.length<5 || user.password.length<5){
      this.errorMessage="All fields at least 5char";
      return;
    }
  }
  checkErrorStrong(user:IUser,findUser:IUser){
       if(findUser==undefined){
      this.errorMessage="Username is not registered";
      return;
    }
    if(user.password!==findUser.password){
      this.errorMessage="Password is not correct";
      return;
    }
  }
    
  async onSubmit() {
    this.errorMessage='';
    let user=<IUser>{
      username:this.loginForm.controls['username'].value,
      password:this.loginForm.controls['password'].value
    }
    this.checkError(user);
    if(this.errorMessage)return;

    let findUser=this.users?.find(u=>u.username===user.username)!;
    this.checkErrorStrong(user,findUser);

    if(!this.errorMessage){
      localStorage.setItem('user',JSON.stringify(findUser));
    
      this.router.navigate(['/wall']);
      this.dialog.closeAll();
    }
    
    return;
  }
  tickbox(){
    if(this.tickValue){
      this.tickValue=false;
       return;
    }
    if(!this.tickValue){
      this.tickValue=true;
       return;
    }
  }
  }

  