import { Directive, ElementRef } from '@angular/core';

@Directive({standalone: true, selector: '[darkIcon]'})
export class OmDarkIcon {
  constructor(public el: ElementRef) {
  }
}

@Directive({standalone: true, selector: '[lightIcon]'})
export class OmLightIcon {
  constructor(public el: ElementRef) {
  }
}

@Directive({standalone: true, selector: '[toggleLabel]'})
export class OmLabel {
  constructor(public el: ElementRef) {
  }
}
