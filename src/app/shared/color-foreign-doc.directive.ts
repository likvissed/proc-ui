import { Directive, ElementRef, Input, AfterViewChecked } from '@angular/core';

@Directive({
  selector: '[colorForeign]',
})
export class ClolrForeignDocDirective implements AfterViewChecked {
  @Input() flag: false;

  constructor(
    private elementRef: ElementRef
  ){
  }

  ngAfterViewChecked(): void {
    if (!this.flag) {
      return;
    }

    this.elementRef.nativeElement.style.backgroundColor = "#c9a0e8";
  }

}
