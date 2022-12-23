import { Component, OnInit, ɵgetUnknownElementStrictMode } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms'
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private dialog: MatDialog,private router:Router,private http:HttpClient) {}
   
public errorMessage:string='';
  
  registerForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  openLogin() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop=true;
    dialogConfig.closeOnNavigation=false;

    this.dialog.open(LoginComponent,dialogConfig);
}

/*async onSubmit() {

  let user=<IUser>{
    username:this.registerForm.controls['username'].value,
    password:this.registerForm.controls['password'].value,
    email:'',
    image:'',
    cart:this.booksCart
  }
  let confirm=this.registerForm.controls['confirmPassword'].value;
  
  const headers= new HttpHeaders().set('content-type', 'application/json');
  await this.http.get<IUser[]>('http://localhost:3000/users').subscribe({
      next:(value)=>{
        this.users=value;
        headers:headers;
      }});
     
     setTimeout(() => console.log(this.users),1000);
        
   
  if(!(user.username && user.password && confirm)){
    this.errorMessage='All fields required';
    return;
  }

    if(this.users?.some(u=>u.username===user.username)){
    this.errorMessage="Username already exist";
    let userCheck=this.users?.filter(u=>u.username===user.username);

    if(userCheck.length>1){
      for(let i=1;i<userCheck.length;i++)
      {
        let userDelId=userCheck[i].id;
        this.http.delete<IUser>(`http://localhost:3000/users/${userDelId}`, { 'headers': headers }).subscribe((res)=>{});
      }
    }
    return;
  }

  if(user.username.length<5 || user.password.length<5 || confirm.length<5){
    this.errorMessage="All fields at least 5char";
    return;
  }
  if(user.password !== confirm){
    this.errorMessage="Passwords not the same";
    return;
  }
  
  
    this.http.post<IUser>('http://localhost:3000/users',user, { 'headers': headers }).subscribe((res)=>{localStorage.setItem('user',JSON.stringify(res));});
  
    let token=Math.floor(Math.random()*10000).toString();
    localStorage.setItem('token',token);
    
    this.router.navigate(['/welcome']);
    return;
}*/
}
