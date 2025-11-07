import { AfterViewInit, Component, ContentChild, ElementRef, inject, Input, OnDestroy, PLATFORM_ID, signal, ViewChild, } from '@angular/core';
import { isPlatformBrowser } from "@angular/common";
import { OmDarkIcon, OmLabel, OmLightIcon } from "./ngx-theme-toggle.directive";
import { OmThemeAnimationStyle } from "./ngx-theme-toggle.types";

@Component({
  selector: 'om-theme-toggle',
  imports: [OmDarkIcon, OmLightIcon, OmLabel],
  standalone: true,
  templateUrl: "./ngx-theme-toggle.component.html",
  styleUrl: "./ngx-theme-toggle.component.scss",
})
export class NgxThemeToggleComponent implements AfterViewInit, OnDestroy {
  @Input() duration = 400;
  @Input() themeTarget: string = "html";
  @Input() themeAttribute?: string;
  @Input() lightThemeClass = "light";
  @Input() darkThemeClass = "dark";
  @Input() animationStyle: OmThemeAnimationStyle = 'circle';
  @Input() showText = false;

  @ViewChild("themeButton") buttonRef!: ElementRef<HTMLButtonElement>;
  @ContentChild(OmDarkIcon) darkIconRef?: OmDarkIcon;
  @ContentChild(OmLightIcon) lightIconRef?: OmLightIcon;
  @ContentChild(OmLabel) labelRef?: OmLabel;

  hasDarkIcon = signal(false);
  hasLightIcon = signal(false);
  hasLabel = signal(false);
  isDark = signal(false);

  private observer?: MutationObserver;
  private readonly platformId = inject(PLATFORM_ID);
  private themeElement?: HTMLElement;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.hasDarkIcon.set(!!this.darkIconRef);
    this.hasLightIcon.set(!!this.lightIconRef);
    this.hasLabel.set(!!this.labelRef);

    this.themeElement =
      ({html: document.documentElement, body: document.body} as Record<string, HTMLElement>)[this.themeTarget]
      ?? (document.querySelector(this.themeTarget) as HTMLElement | null)
      ?? undefined;

    if (!this.themeElement) return;

    this.initThemeFromStorage();

    const updateTheme = () => {
      const isDark = this.themeAttribute
        ? this.themeElement!.getAttribute(this.themeAttribute) === this.darkThemeClass
        : this.themeElement!.classList.contains(this.darkThemeClass);
      this.isDark.set(isDark);
    };

    updateTheme();

    this.observer = new MutationObserver(updateTheme);
    this.observer.observe(this.themeElement, {
      attributes: true,
      attributeFilter: this.themeAttribute ? [this.themeAttribute] : ["class"],
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private applyTheme(newTheme: boolean) {
    if (!this.themeElement) return;

    if (this.themeAttribute) {
      this.themeElement.setAttribute(
        this.themeAttribute,
        newTheme ? this.darkThemeClass : this.lightThemeClass
      );
    } else {
      this.themeElement.classList.toggle(this.darkThemeClass, newTheme);
      this.themeElement.classList.toggle(this.lightThemeClass, !newTheme);
    }

    localStorage.setItem("theme", newTheme ? this.darkThemeClass : this.lightThemeClass);
    this.isDark.set(newTheme);
  }

  toggleTheme() {
    if (!isPlatformBrowser(this.platformId) || !this.buttonRef?.nativeElement || !this.themeElement) return;

    const button = this.buttonRef.nativeElement;
    const newTheme = !this.isDark();

    const startViewTransition = (document as any).startViewTransition?.bind(document);
    if (typeof startViewTransition !== 'function') {
      this.applyTheme(newTheme);
      return;
    }

    startViewTransition(() => this.applyTheme(newTheme)).ready.then(() => {
      const root = document.documentElement;
      const {top, left, width, height} = button.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      );

      let keyframes: Keyframe[] = [];

      switch (this.animationStyle) {
        case 'circle':
          keyframes = [
            {clipPath: `circle(0px at ${x}px ${y}px)`},
            {clipPath: `circle(${maxRadius}px at ${x}px ${y}px)`},
          ];
          break;
        case 'diagonal':
          keyframes = [
            {clipPath: 'polygon(0 0, 0 0, 0 0, 0 0)'},
            {clipPath: 'polygon(0 0, 100% 0, 0 100%, 0 100%)'},
            {clipPath: 'polygon(0 0, 200% 0, 0 200%, 0 200%)'},
          ];
          break;
        case 'wipe':
          keyframes = [
            {clipPath: `inset(0 100% 0 0)`},
            {clipPath: `inset(0 0 0 0)`},
          ];
          break;
        case 'fade':
          keyframes = [
            {opacity: 0},
            {opacity: 1},
          ];
          break;
      }

      root.animate(keyframes, {
        duration: this.duration,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      });
    });
  }

  private initThemeFromStorage() {
    if (!this.themeElement) return;

    const stored = localStorage.getItem('theme');
    if (!stored) return;

    const hasThemeAlready = this.themeAttribute
      ? this.themeElement.hasAttribute(this.themeAttribute)
      : (this.themeElement.classList.contains(this.darkThemeClass) ||
        this.themeElement.classList.contains(this.lightThemeClass));

    if (hasThemeAlready) {
      const currentIsDark = this.themeAttribute
        ? this.themeElement.getAttribute(this.themeAttribute) === this.darkThemeClass
        : this.themeElement.classList.contains(this.darkThemeClass);
      this.isDark.set(currentIsDark);
      return;
    }

    const isDarkStored =
      stored === this.darkThemeClass || stored.toLowerCase() === 'dark';
    const appliedValue = isDarkStored ? this.darkThemeClass : this.lightThemeClass;

    if (this.themeAttribute) {
      this.themeElement.setAttribute(this.themeAttribute, appliedValue);
    } else {
      this.themeElement.classList.toggle(this.darkThemeClass, isDarkStored);
      this.themeElement.classList.toggle(this.lightThemeClass, !isDarkStored);
    }

    localStorage.setItem('theme', appliedValue);
    this.isDark.set(isDarkStored);
  }
}
