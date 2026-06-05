import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

type FadeEffect = 'up' | 'fade' | 'left' | 'right' | 'scale';

@Directive({ selector: '[appFadeIn]', standalone: true })
export class FadeInDirective implements OnInit, OnDestroy {
  @Input() appFadeIn: FadeEffect = 'up';
  @Input() fadeDelay: number = 0;
  @Input() fadeDuration: number = 700;

  private observer?: IntersectionObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const el = this.el.nativeElement as HTMLElement;
    this.renderer.addClass(el, 'fi-init');
    this.renderer.addClass(el, `fi-${this.appFadeIn}`);
    el.style.setProperty('--fi-delay', `${this.fadeDelay}ms`);
    el.style.setProperty('--fi-duration', `${this.fadeDuration}ms`);

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(el, 'fi-visible');
            this.observer?.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
