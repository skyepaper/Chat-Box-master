import { Component, OnInit, ɵgetUnknownElementStrictMode } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { LoginComponent } from '../login/login.component';
import { IUser } from 'src/app/interface/user';

import * as crypto from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private dialog: MatDialog,private router:Router,private http:HttpClient) {}
  ngOnInit(): void {
    this.getUsers();
    this.errorMessage='';
  }
public errorMessage:string='';
public tickValue=true;
friends:string[]=[];
image:string='';
  
  registerForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  users:IUser[]|null=null;

openLogin() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;

    this.dialog.open(LoginComponent,dialogConfig);
}

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
     if(findUser){
    this.errorMessage="Username already exist";
    return;
  }
}

async onSubmit() {
  this.errorMessage='';
 
  let user=<IUser>{
    username:this.registerForm.controls['username'].value,
    password:this.registerForm.controls['password'].value,
    image:this.image,
    friends:this.friends,
  }
  let confirm=this.registerForm.controls['confirmPassword'].value;
  
  this.checkError(user);
  if(this.errorMessage)return;
  
  if(!confirm){
    this.errorMessage='All fields required';
    return;
  }
  if(confirm.length<5){
    this.errorMessage="All fields at least 5char";
    return;
  }
  if(user.password !== confirm){
    this.errorMessage="Passwords not the same";
    return;
  }

  let findUser=this.users?.find(u=>u.username===user.username)!;
    this.checkErrorStrong(user,findUser);

    if(!this.errorMessage){
    
    this.http.post<IUser>('https://63af5f75649c73f572baa737.mockapi.io/users',user).subscribe((res)=>{localStorage.setItem('user',JSON.stringify(res));});
    this.router.navigate(['/wall']);
    this.dialog.closeAll();
    return;
    }
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
