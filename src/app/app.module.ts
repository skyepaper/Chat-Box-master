import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {ReactiveFormsModule } from '@angular/forms';
import {FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations"

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './auth/register/register.component';
import { WallComponent } from './wall/wall.component';
import { AppRoutingModule } from './app-routing.module';
import { UsersComponent } from './users/users.component';
import { AboutComponent } from './about/about.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendRequestComponent } from './friendRequest/friend-request.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    LoginComponent,
    RegisterComponent,
    WallComponent,
    UsersComponent,
    AboutComponent,
    NewMessageComponent,
    ProfileComponent,
    FriendRequestComponent,
    AlertMessageComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
   
  ],
  providers: [DatePipe,NavComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
