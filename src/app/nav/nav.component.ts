import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { LoginComponent } from '../auth/login/login.component';
import { RegisterComponent } from '../auth/register/register.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

constructor(private dialog: MatDialog) {}

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
}
