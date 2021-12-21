import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notice',
  template: `
    <ngb-toast
      *ngFor="let toast of notificationService.toasts"
      [header]="toast.headertext"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="toast.delay || 5000"
      (hide)="notificationService.remove(toast)"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {'[class.ngb-toasts]': 'true'}
})
export class NoticeComponent {

  constructor(
    public notificationService: NotificationService
  ) { }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
