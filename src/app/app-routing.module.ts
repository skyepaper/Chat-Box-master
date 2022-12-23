import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { NewMessageComponent } from './new-message/new-message.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { WallComponent } from './wall/wall.component';


const routes: Routes = [
  {path:'wall',component:WallComponent},
  {path:'users',component:UsersComponent},
  {path:'about',component:AboutComponent},
  {path:'newMessage',component:NewMessageComponent},
  {path:'profile',component:ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
