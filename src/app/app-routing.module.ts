import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';
import { BaseComponent } from './base/base.component';
import { ListComponent } from './list/list.component';
import { RequestResolver } from './requests.resolver';


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
