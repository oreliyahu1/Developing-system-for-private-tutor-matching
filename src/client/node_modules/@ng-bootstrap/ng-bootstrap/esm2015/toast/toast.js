import { Attribute, Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation, ElementRef, NgZone, } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgbToastConfig } from './toast-config';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbToastFadeInTransition, ngbToastFadeOutTransition } from './toast-transition';
/**
 * This directive allows the usage of HTML markup or other directives
 * inside of the toast's header.
 *
 * @since 5.0.0
 */
export class NgbToastHeader {
}
NgbToastHeader.decorators = [
    { type: Directive, args: [{ selector: '[ngbToastHeader]' },] }
];
/**
 * Toasts provide feedback messages as notifications to the user.
 * Goal is to mimic the push notifications available both on mobile and desktop operating systems.
 *
 * @since 5.0.0
 */
export class NgbToast {
    constructor(ariaLive, config, _zone, _element) {
        this.ariaLive = ariaLive;
        this._zone = _zone;
        this._element = _element;
        /**
         * A template like `<ng-template ngbToastHeader></ng-template>` can be
         * used in the projected content to allow markup usage.
         */
        this.contentHeaderTpl = null;
        /**
         * An event fired after the animation triggered by calling `.show()` method has finished.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event fired after the animation triggered by calling `.hide()` method has finished.
         *
         * It can only occur in 2 different scenarios:
         * - `autohide` timeout fires
         * - user clicks on a closing cross
         *
         * Additionally this output is purely informative. The toast won't be removed from DOM automatically, it's up
         * to the user to take care of that.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        if (this.ariaLive == null) {
            this.ariaLive = config.ariaLive;
        }
        this.delay = config.delay;
        this.autohide = config.autohide;
        this.animation = config.animation;
    }
    ngAfterContentInit() {
        this._zone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            this._init();
            this.show();
        });
    }
    ngOnChanges(changes) {
        if ('autohide' in changes) {
            this._clearTimeout();
            this._init();
        }
    }
    /**
     * Triggers toast closing programmatically.
     *
     * The returned observable will emit and be completed once the closing transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(hidden)` output
     *
     * @since 8.0.0
     */
    hide() {
        this._clearTimeout();
        const transition = ngbRunTransition(this._element.nativeElement, ngbToastFadeOutTransition, { animation: this.animation, runningTransition: 'stop' });
        transition.subscribe(() => { this.hidden.emit(); });
        return transition;
    }
    /**
     * Triggers toast opening programmatically.
     *
     * The returned observable will emit and be completed once the opening transition has finished.
     * If the animations are turned off this happens synchronously.
     *
     * Alternatively you could listen or subscribe to the `(shown)` output
     *
     * @since 8.0.0
     */
    show() {
        const transition = ngbRunTransition(this._element.nativeElement, ngbToastFadeInTransition, {
            animation: this.animation,
            runningTransition: 'continue',
        });
        transition.subscribe(() => { this.shown.emit(); });
        return transition;
    }
    _init() {
        if (this.autohide && !this._timeoutID) {
            this._timeoutID = setTimeout(() => this.hide(), this.delay);
        }
    }
    _clearTimeout() {
        if (this._timeoutID) {
            clearTimeout(this._timeoutID);
            this._timeoutID = null;
        }
    }
}
NgbToast.decorators = [
    { type: Component, args: [{
                selector: 'ngb-toast',
                exportAs: 'ngbToast',
                encapsulation: ViewEncapsulation.None,
                host: {
                    'role': 'alert',
                    '[attr.aria-live]': 'ariaLive',
                    'aria-atomic': 'true',
                    'class': 'toast',
                    '[class.fade]': 'animation',
                },
                template: `
    <ng-template #headerTpl>
      <strong class="mr-auto">{{header}}</strong>
    </ng-template>
    <ng-template [ngIf]="contentHeaderTpl || header">
      <div class="toast-header">
        <ng-template [ngTemplateOutlet]="contentHeaderTpl || headerTpl"></ng-template>
        <button type="button" class="close" aria-label="Close" i18n-aria-label="@@ngb.toast.close-aria" (click)="hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </ng-template>
    <div class="toast-body">
      <ng-content></ng-content>
    </div>
  `,
                styles: [".ngb-toasts{margin:.5em;position:fixed;right:0;top:0;z-index:1200}ngb-toast{display:block}ngb-toast .toast-header .close{margin-bottom:.25rem;margin-left:auto}"]
            },] }
];
NgbToast.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['aria-live',] }] },
    { type: NgbToastConfig },
    { type: NgZone },
    { type: ElementRef }
];
NgbToast.propDecorators = {
    animation: [{ type: Input }],
    delay: [{ type: Input }],
    autohide: [{ type: Input }],
    header: [{ type: Input }],
    contentHeaderTpl: [{ type: ContentChild, args: [NgbToastHeader, { read: TemplateRef, static: true },] }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdG9hc3QvdG9hc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFDVCxTQUFTLEVBQ1QsWUFBWSxFQUNaLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sRUFFTixXQUFXLEVBQ1gsaUJBQWlCLEVBQ2pCLFVBQVUsRUFDVixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRXBDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUNsRSxPQUFPLEVBQUMsd0JBQXdCLEVBQUUseUJBQXlCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUd2Rjs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxjQUFjOzs7WUFEMUIsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFDOztBQUl6Qzs7Ozs7R0FLRztBQThCSCxNQUFNLE9BQU8sUUFBUTtJQTBEbkIsWUFDbUMsUUFBZ0IsRUFBRSxNQUFzQixFQUFVLEtBQWEsRUFDdEYsUUFBb0I7UUFERyxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQWtDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDdEYsYUFBUSxHQUFSLFFBQVEsQ0FBWTtRQTdCaEM7OztXQUdHO1FBQzhELHFCQUFnQixHQUEyQixJQUFJLENBQUM7UUFFakg7Ozs7V0FJRztRQUNPLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTNDOzs7Ozs7Ozs7OztXQVdHO1FBQ08sV0FBTSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFLMUMsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRTtZQUN6QixJQUFJLENBQUMsUUFB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a0VULEtBQUs7b0JBUUwsS0FBSzt1QkFNTCxLQUFLO3FCQU1MLEtBQUs7K0JBTUwsWUFBWSxTQUFDLGNBQWMsRUFBRSxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBQztvQkFPOUQsTUFBTTtxQkFjTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQXR0cmlidXRlLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uLFxuICBFbGVtZW50UmVmLFxuICBOZ1pvbmUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHt0YWtlfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7TmdiVG9hc3RDb25maWd9IGZyb20gJy4vdG9hc3QtY29uZmlnJztcbmltcG9ydCB7bmdiUnVuVHJhbnNpdGlvbn0gZnJvbSAnLi4vdXRpbC90cmFuc2l0aW9uL25nYlRyYW5zaXRpb24nO1xuaW1wb3J0IHtuZ2JUb2FzdEZhZGVJblRyYW5zaXRpb24sIG5nYlRvYXN0RmFkZU91dFRyYW5zaXRpb259IGZyb20gJy4vdG9hc3QtdHJhbnNpdGlvbic7XG5cblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBhbGxvd3MgdGhlIHVzYWdlIG9mIEhUTUwgbWFya3VwIG9yIG90aGVyIGRpcmVjdGl2ZXNcbiAqIGluc2lkZSBvZiB0aGUgdG9hc3QncyBoZWFkZXIuXG4gKlxuICogQHNpbmNlIDUuMC4wXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlRvYXN0SGVhZGVyXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlRvYXN0SGVhZGVyIHtcbn1cblxuLyoqXG4gKiBUb2FzdHMgcHJvdmlkZSBmZWVkYmFjayBtZXNzYWdlcyBhcyBub3RpZmljYXRpb25zIHRvIHRoZSB1c2VyLlxuICogR29hbCBpcyB0byBtaW1pYyB0aGUgcHVzaCBub3RpZmljYXRpb25zIGF2YWlsYWJsZSBib3RoIG9uIG1vYmlsZSBhbmQgZGVza3RvcCBvcGVyYXRpbmcgc3lzdGVtcy5cbiAqXG4gKiBAc2luY2UgNS4wLjBcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXRvYXN0JyxcbiAgZXhwb3J0QXM6ICduZ2JUb2FzdCcsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGhvc3Q6IHtcbiAgICAncm9sZSc6ICdhbGVydCcsXG4gICAgJ1thdHRyLmFyaWEtbGl2ZV0nOiAnYXJpYUxpdmUnLFxuICAgICdhcmlhLWF0b21pYyc6ICd0cnVlJyxcbiAgICAnY2xhc3MnOiAndG9hc3QnLFxuICAgICdbY2xhc3MuZmFkZV0nOiAnYW5pbWF0aW9uJyxcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGUgI2hlYWRlclRwbD5cbiAgICAgIDxzdHJvbmcgY2xhc3M9XCJtci1hdXRvXCI+e3toZWFkZXJ9fTwvc3Ryb25nPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cImNvbnRlbnRIZWFkZXJUcGwgfHwgaGVhZGVyXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwidG9hc3QtaGVhZGVyXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJjb250ZW50SGVhZGVyVHBsIHx8IGhlYWRlclRwbFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50b2FzdC5jbG9zZS1hcmlhXCIgKGNsaWNrKT1cImhpZGUoKVwiPlxuICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8ZGl2IGNsYXNzPVwidG9hc3QtYm9keVwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICBgLFxuICBzdHlsZVVybHM6IFsnLi90b2FzdC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgTmdiVG9hc3QgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LFxuICAgIE9uQ2hhbmdlcyB7XG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRvYXN0IG9wZW5pbmcgYW5kIGNsb3Npbmcgd2lsbCBiZSBhbmltYXRlZC5cbiAgICpcbiAgICogQW5pbWF0aW9uIGlzIHRyaWdnZXJlZCBvbmx5IHdoZW4gdGhlIGAuaGlkZSgpYCBvciBgLnNob3coKWAgZnVuY3Rpb25zIGFyZSBjYWxsZWRcbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cbiAgcHJpdmF0ZSBfdGltZW91dElEO1xuXG4gIC8qKlxuICAgKiBEZWxheSBhZnRlciB3aGljaCB0aGUgdG9hc3Qgd2lsbCBoaWRlIChtcykuXG4gICAqIGRlZmF1bHQ6IGA1MDBgIChtcykgKGluaGVyaXRlZCBmcm9tIE5nYlRvYXN0Q29uZmlnKVxuICAgKi9cbiAgQElucHV0KCkgZGVsYXk6IG51bWJlcjtcblxuICAvKipcbiAgICogQXV0byBoaWRlIHRoZSB0b2FzdCBhZnRlciBhIGRlbGF5IGluIG1zLlxuICAgKiBkZWZhdWx0OiBgdHJ1ZWAgKGluaGVyaXRlZCBmcm9tIE5nYlRvYXN0Q29uZmlnKVxuICAgKi9cbiAgQElucHV0KCkgYXV0b2hpZGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRleHQgdG8gYmUgdXNlZCBhcyB0b2FzdCdzIGhlYWRlci5cbiAgICogSWdub3JlZCBpZiBhIENvbnRlbnRDaGlsZCB0ZW1wbGF0ZSBpcyBzcGVjaWZpZWQgYXQgdGhlIHNhbWUgdGltZS5cbiAgICovXG4gIEBJbnB1dCgpIGhlYWRlcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHRlbXBsYXRlIGxpa2UgYDxuZy10ZW1wbGF0ZSBuZ2JUb2FzdEhlYWRlcj48L25nLXRlbXBsYXRlPmAgY2FuIGJlXG4gICAqIHVzZWQgaW4gdGhlIHByb2plY3RlZCBjb250ZW50IHRvIGFsbG93IG1hcmt1cCB1c2FnZS5cbiAgICovXG4gIEBDb250ZW50Q2hpbGQoTmdiVG9hc3RIZWFkZXIsIHtyZWFkOiBUZW1wbGF0ZVJlZiwgc3RhdGljOiB0cnVlfSkgY29udGVudEhlYWRlclRwbDogVGVtcGxhdGVSZWY8YW55PnwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIGFmdGVyIHRoZSBhbmltYXRpb24gdHJpZ2dlcmVkIGJ5IGNhbGxpbmcgYC5zaG93KClgIG1ldGhvZCBoYXMgZmluaXNoZWQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCBhZnRlciB0aGUgYW5pbWF0aW9uIHRyaWdnZXJlZCBieSBjYWxsaW5nIGAuaGlkZSgpYCBtZXRob2QgaGFzIGZpbmlzaGVkLlxuICAgKlxuICAgKiBJdCBjYW4gb25seSBvY2N1ciBpbiAyIGRpZmZlcmVudCBzY2VuYXJpb3M6XG4gICAqIC0gYGF1dG9oaWRlYCB0aW1lb3V0IGZpcmVzXG4gICAqIC0gdXNlciBjbGlja3Mgb24gYSBjbG9zaW5nIGNyb3NzXG4gICAqXG4gICAqIEFkZGl0aW9uYWxseSB0aGlzIG91dHB1dCBpcyBwdXJlbHkgaW5mb3JtYXRpdmUuIFRoZSB0b2FzdCB3b24ndCBiZSByZW1vdmVkIGZyb20gRE9NIGF1dG9tYXRpY2FsbHksIGl0J3MgdXBcbiAgICogdG8gdGhlIHVzZXIgdG8gdGFrZSBjYXJlIG9mIHRoYXQuXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScpIHB1YmxpYyBhcmlhTGl2ZTogc3RyaW5nLCBjb25maWc6IE5nYlRvYXN0Q29uZmlnLCBwcml2YXRlIF96b25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgaWYgKHRoaXMuYXJpYUxpdmUgPT0gbnVsbCkge1xuICAgICAgdGhpcy5hcmlhTGl2ZSA9IGNvbmZpZy5hcmlhTGl2ZTtcbiAgICB9XG4gICAgdGhpcy5kZWxheSA9IGNvbmZpZy5kZWxheTtcbiAgICB0aGlzLmF1dG9oaWRlID0gY29uZmlnLmF1dG9oaWRlO1xuICAgIHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICB0aGlzLl96b25lLm9uU3RhYmxlLmFzT2JzZXJ2YWJsZSgpLnBpcGUodGFrZSgxKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuX2luaXQoKTtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICgnYXV0b2hpZGUnIGluIGNoYW5nZXMpIHtcbiAgICAgIHRoaXMuX2NsZWFyVGltZW91dCgpO1xuICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VycyB0b2FzdCBjbG9zaW5nIHByb2dyYW1tYXRpY2FsbHkuXG4gICAqXG4gICAqIFRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBhbmQgYmUgY29tcGxldGVkIG9uY2UgdGhlIGNsb3NpbmcgdHJhbnNpdGlvbiBoYXMgZmluaXNoZWQuXG4gICAqIElmIHRoZSBhbmltYXRpb25zIGFyZSB0dXJuZWQgb2ZmIHRoaXMgaGFwcGVucyBzeW5jaHJvbm91c2x5LlxuICAgKlxuICAgKiBBbHRlcm5hdGl2ZWx5IHlvdSBjb3VsZCBsaXN0ZW4gb3Igc3Vic2NyaWJlIHRvIHRoZSBgKGhpZGRlbilgIG91dHB1dFxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIGhpZGUoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgdGhpcy5fY2xlYXJUaW1lb3V0KCk7XG4gICAgY29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24oXG4gICAgICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiVG9hc3RGYWRlT3V0VHJhbnNpdGlvbiwge2FuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCd9KTtcbiAgICB0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7IHRoaXMuaGlkZGVuLmVtaXQoKTsgfSk7XG4gICAgcmV0dXJuIHRyYW5zaXRpb247XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcnMgdG9hc3Qgb3BlbmluZyBwcm9ncmFtbWF0aWNhbGx5LlxuICAgKlxuICAgKiBUaGUgcmV0dXJuZWQgb2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW5kIGJlIGNvbXBsZXRlZCBvbmNlIHRoZSBvcGVuaW5nIHRyYW5zaXRpb24gaGFzIGZpbmlzaGVkLlxuICAgKiBJZiB0aGUgYW5pbWF0aW9ucyBhcmUgdHVybmVkIG9mZiB0aGlzIGhhcHBlbnMgc3luY2hyb25vdXNseS5cbiAgICpcbiAgICogQWx0ZXJuYXRpdmVseSB5b3UgY291bGQgbGlzdGVuIG9yIHN1YnNjcmliZSB0byB0aGUgYChzaG93bilgIG91dHB1dFxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIHNob3coKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgY29uc3QgdHJhbnNpdGlvbiA9IG5nYlJ1blRyYW5zaXRpb24odGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBuZ2JUb2FzdEZhZGVJblRyYW5zaXRpb24sIHtcbiAgICAgIGFuaW1hdGlvbjogdGhpcy5hbmltYXRpb24sXG4gICAgICBydW5uaW5nVHJhbnNpdGlvbjogJ2NvbnRpbnVlJyxcbiAgICB9KTtcbiAgICB0cmFuc2l0aW9uLnN1YnNjcmliZSgoKSA9PiB7IHRoaXMuc2hvd24uZW1pdCgpOyB9KTtcbiAgICByZXR1cm4gdHJhbnNpdGlvbjtcbiAgfVxuXG4gIHByaXZhdGUgX2luaXQoKSB7XG4gICAgaWYgKHRoaXMuYXV0b2hpZGUgJiYgIXRoaXMuX3RpbWVvdXRJRCkge1xuICAgICAgdGhpcy5fdGltZW91dElEID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLmhpZGUoKSwgdGhpcy5kZWxheSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJUaW1lb3V0KCkge1xuICAgIGlmICh0aGlzLl90aW1lb3V0SUQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl90aW1lb3V0SUQpO1xuICAgICAgdGhpcy5fdGltZW91dElEID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cbiJdfQ==