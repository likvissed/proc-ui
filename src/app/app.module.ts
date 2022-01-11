import { AuthCenterModule } from '@iss/ng-auth-center';

import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import ruLocale from '@angular/common/locales/ru';

import { AppComponent } from './app.component';
import { NewComponent } from './components/auth/new/new.component';
import { MainComponent } from './components/auth/main/main.component';
import { BaseComponent } from './components/auth/base/base.component';
import { ListComponent } from './components/auth/list/list.component';
import { ChancelleryComponent } from './components/auth/chancellery/chancellery.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthorityComponent } from './components/auth/authority/authority.component';

import { ShortNamePipe } from './shared/shortName.pipe';
import { NameForStatusPipe } from './shared/nameForStatus.pipe';

import { TemplateModalComponent } from './components/auth/template-modal/template-modal.component';
import { DoneModalComponent } from './components/auth/done-modal/done-modal.component';
import { WithdrawModalComponent } from './components/auth/withdraw-modal/withdraw-modal.component';
import { RegistrationModalComponent } from './components/auth/registration-modal/registration-modal.component';
import { NoticeComponent } from './components/notice/notice.component';
import { EditAuthorityComponent } from './components/auth/edit-authority/edit-authority.component';
import { ConfirmationDialogComponent } from './components/auth/confirmation-dialog/confirmation-dialog.component';

registerLocaleData(ruLocale, 'ru')

@NgModule({
  declarations: [
    AppComponent,
    NewComponent,
    MainComponent,
    BaseComponent,
    ListComponent,
    ShortNamePipe,
    NameForStatusPipe,
    TemplateModalComponent,
    DoneModalComponent,
    ChancelleryComponent,
    WithdrawModalComponent,
    RegistrationModalComponent,
    NotFoundComponent,
    NoticeComponent,
    AuthorityComponent,
    EditAuthorityComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    HttpClientModule,
    AuthCenterModule.forRoot(environment.auth),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru-RU' }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    TemplateModalComponent,
    WithdrawModalComponent,
    RegistrationModalComponent
  ]
})
export class AppModule { }
