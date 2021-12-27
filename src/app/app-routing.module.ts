import { AuthCenterGuard } from '@iss/ng-auth-center';
import { ChancelleryComponent } from './components/auth/chancellery/chancellery.component';
import { MainComponent } from './components/auth/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './components/auth/new/new.component';
import { BaseComponent } from './components/auth/base/base.component';
import { ListComponent } from './components/auth/list/list.component';
import { RequestResolver } from './shared/requests.resolver';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: '/base', pathMatch: 'full' },
      { path: 'requests/new', redirectTo: '/new' }, // оставлен старый адрес приложения
      { path: 'base', component: BaseComponent, canActivate: [AuthCenterGuard] },
      { path: 'new', component: NewComponent, canActivate: [AuthCenterGuard] },
      { path: 'new/:id', component: NewComponent, resolve: { presentRequest: RequestResolver }, canActivate: [AuthCenterGuard] },
      { path: 'list', component: ListComponent, canActivate: [AuthCenterGuard] },
      { path: 'chancellery', component: ChancelleryComponent, canActivate: [AuthCenterGuard] }
    ]
  },
  { path: 'not_found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not_found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
