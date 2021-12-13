import { Component } from '@angular/core';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbPopoverConfig]
})
export class AppComponent {
  constructor(config: NgbPopoverConfig) {
    config.container = 'body';
  }
}
