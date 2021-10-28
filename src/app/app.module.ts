import { AuthService } from './services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewComponent } from './components/auth/new/new.component';
import { MainComponent } from './components/auth/main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { registerLocaleData } from '@angular/common';
import ruLocale from '@angular/common/locales/ru';
import { BaseComponent } from './components/auth/base/base.component';
import { ListComponent } from './components/auth/list/list.component';
import { ShortNamePipe } from './shared/shortName.pipe';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { AuthGuard } from './services/auth.guard';
import { AuthorizeUserComponent } from './components/authorize-user/authorize-user.component';
import { NewModalComponent } from './components/auth/new-modal/new-modal.component';

registerLocaleData(ruLocale, 'ru')

@NgModule({
  declarations: [
    AppComponent,
    NewComponent,
    MainComponent,
    BaseComponent,
    ListComponent,
    ShortNamePipe,
    SignInComponent,
    AuthorizeUserComponent,
    NewModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'ru-RU' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
