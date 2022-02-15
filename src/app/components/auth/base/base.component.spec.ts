import { ListComponent } from './../list/list.component';
import { NewComponent } from './../new/new.component';
import { BaseComponent } from './base.component';

import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ComponentFixture, fakeAsync, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BaseComponent,
        NewComponent,
        ListComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(
          [
            { path: 'new', component: NewComponent },
            { path: 'list', component: ListComponent }
          ]
         ),
        FormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
  })

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should have content in html ', () => {
    let html_result = '<h3> Создать <a routerlink="/new" ng-reflect-router-link="/new"> новую доверенность </a></h3>' + '<br>' +
    '<h3> Создать <a routerlink="/list" ng-reflect-router-link="/list"> на основе существующей </a></h3>';

    const element = fixture.debugElement.query(By.css('.auth-content')).nativeElement;

    expect(element.innerHTML).toEqual(html_result);
  });

  it('navigate to "new" takes you to /new', fakeAsync(() => {
    inject([Router], (router: Router) => {
      router.navigateByUrl('/new');

      expect(fixture.debugElement.query(By.css('app-new'))).toBeTruthy();
    })
  }));

  it('navigate to "list" takes you to /list', fakeAsync(() => {
    inject([Router], (router: Router) => {
      router.navigateByUrl('/list');

      expect(fixture.debugElement.query(By.css('app-list'))).toBeTruthy();
    })
  }));
});
