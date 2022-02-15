import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AuthHelper, AuthHelperStub } from '@iss/ng-auth-center';
import { BehaviorSubject, of } from 'rxjs';

import { MainComponent } from './main.component';
import { LoadingService } from './../../../services/loading.service';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  let loadingService: LoadingService;
  let authHelper: AuthHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainComponent
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserModule
      ],
      providers: [
        LoadingService,
        { provide: AuthHelper, useClass: AuthHelperStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;

    authHelper = TestBed.inject(AuthHelper);
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  describe('when user is authenticated', () => {
    let jwt = {
        access_to_chancellery: true,
        access_to_duties: true,
        fio: "Иванов Иван Владимирович",
        fio_initials: "Иванов И.В.",
        id_tn: "12345",
        login: "IvanovIV",
        tel: "11-00",
        tn: "54321",
      }

    beforeEach(() => {
      authHelper.isAuthenticated$ = new BehaviorSubject<boolean>(true);

      spyOn(authHelper, 'getJwtPayload').and.returnValue(jwt);
    })

    it('should be loaded isAuth', fakeAsync(() => {
      authHelper.isAuthenticated$.subscribe(_ => {
        fixture.detectChanges();

        expect(component.isAuthenticated).toBeTruthy();
      })

      flush();
    }));

    it('on init jwt users should be loaded', fakeAsync(() => {
      authHelper.isAuthenticated$.subscribe(_ => {
        fixture.detectChanges();

        expect(component.fio_initials).toEqual(jwt.fio_initials);
        expect(component.access_to_chancellery).toEqual(jwt.access_to_chancellery);
        expect(component.access_to_duties).toEqual(jwt.access_to_duties);
      })

      flush();
    }));

    it('shoukd be call method logout()', () => {
      spyOn(authHelper, 'logout');

      component.logout();

      expect(authHelper.logout).toHaveBeenCalled();
    });
  });

  describe('when user isn`t authenticated', () => {
    beforeEach(() => {
      authHelper.isAuthenticated$ = new BehaviorSubject<boolean>(false);
    })

    it('should be not loaded isAuth', fakeAsync(() => {
      authHelper.isAuthenticated$.subscribe(_ => {
        fixture.detectChanges();

        expect(component.isAuthenticated).toBeFalsy();
      })

      flush();
    }));
  });

});


