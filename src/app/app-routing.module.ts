import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewComponent } from './new/new.component';


const routes: Routes = [
  {
    path: '', component: MainComponent, children: [
     { path: '', redirectTo: '/', pathMatch: 'full' },
     { path: 'new', component: NewComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
