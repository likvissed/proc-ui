import { AuthService } from './services/auth.service';
import { MainComponent } from './components/auth/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './components/auth/new/new.component';
import { BaseComponent } from './components/auth/base/base.component';
import { ListComponent } from './components/auth/list/list.component';
import { RequestResolver } from './shared/requests.resolver';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './services/auth.guard';
import { AuthorizeUserComponent } from './components/authorize-user/authorize-user.component';


const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: '/base', pathMatch: 'full' },
      { path: 'base', component: BaseComponent },
      { path: 'new', component: NewComponent },
      { path: 'new/:id', component: NewComponent, resolve: { presentRequest: RequestResolver } },
      { path: 'list', component: ListComponent } // , canActivate: [AuthGuard]
    ]
  },
  { path: 'sign_in', component: SignInComponent },
  { path: 'users/callbacks/authorize_user', component: AuthorizeUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
