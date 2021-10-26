import { MainComponent } from './components/auth/main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './components/auth/new/new.component';
import { BaseComponent } from './components/auth/base/base.component';
import { ListComponent } from './components/auth/list/list.component';
import { RequestResolver } from './shared/requests.resolver';


const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
      { path: '', redirectTo: '/base', pathMatch: 'full' },
      { path: 'base', component: BaseComponent },
      { path: 'new', component: NewComponent },
      { path: 'new/:id', component: NewComponent, resolve: { presentRequest: RequestResolver } },
      { path: 'list', component: ListComponent }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
