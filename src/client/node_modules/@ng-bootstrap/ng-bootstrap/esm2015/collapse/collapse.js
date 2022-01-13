import { Directive, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { ngbRunTransition } from '../util/transition/ngbTransition';
import { ngbCollapsingTransition } from '../util/transition/ngbCollapseTransition';
import { NgbCollapseConfig } from './collapse-config';
/**
 * A directive to provide a simple way of hiding and showing elements on the page.
 */
export class NgbCollapse {
    constructor(_element, config) {
        this._element = _element;
        /**
         * If `true`, collapse will be animated.
         *
         * Animation is triggered only when clicked on triggering element
         * or via the `.toggle()` function
         *
         * @since 8.0.0
         */
        this.animation = false;
        /**
         * If `true`, will collapse the element or show it otherwise.
         */
        this.collapsed = false;
        this.ngbCollapseChange = new EventEmitter();
        /**
         * An event emitted when the collapse element is shown, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the collapse element is hidden, after the transition. It has no payload.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.animation = config.animation;
    }
    ngOnInit() {
        this._element.nativeElement.classList.add('collapse');
        this._runTransition(this.collapsed, false, false);
    }
    ngOnChanges({ collapsed }) {
        if (!collapsed.firstChange) {
            this._runTransition(this.collapsed, this.animation);
        }
    }
    /**
     * Triggers collapsing programmatically.
     *
     * If there is a collapsing transition running already, it will be reversed.
     * If the animations are turned off this happens synchronously.
     *
     * @since 8.0.0
     */
    toggle(open = this.collapsed) {
        this.collapsed = !open;
        this.ngbCollapseChange.next(this.collapsed);
        this._runTransition(this.collapsed, this.animation);
    }
    _runTransition(collapsed, animation, emitEvent = true) {
        ngbRunTransition(this._element.nativeElement, ngbCollapsingTransition, {
            animation,
            runningTransition: 'stop',
            context: { direction: collapsed ? 'hide' : 'show' }
        }).subscribe(() => {
            if (emitEvent) {
                if (collapsed) {
                    this.hidden.emit();
                }
                else {
                    this.shown.emit();
                }
            }
        });
    }
}
NgbCollapse.decorators = [
    { type: Directive, args: [{ selector: '[ngbCollapse]', exportAs: 'ngbCollapse' },] }
];
NgbCollapse.ctorParameters = () => [
    { type: ElementRef },
    { type: NgbCollapseConfig }
];
NgbCollapse.propDecorators = {
    animation: [{ type: Input }],
    collapsed: [{ type: Input, args: ['ngbCollapse',] }],
    ngbCollapseChange: [{ type: Output }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGFwc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29sbGFwc2UvY29sbGFwc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEdBRVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sa0NBQWtDLENBQUM7QUFDbEUsT0FBTyxFQUFDLHVCQUF1QixFQUFDLE1BQU0sMENBQTBDLENBQUM7QUFDakYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFcEQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sV0FBVztJQWlDdEIsWUFBb0IsUUFBb0IsRUFBRSxNQUF5QjtRQUEvQyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBaEN4Qzs7Ozs7OztXQU9HO1FBQ00sY0FBUyxHQUFHLEtBQUssQ0FBQztRQUUzQjs7V0FFRztRQUNtQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRTlCLHNCQUFpQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFFMUQ7Ozs7V0FJRztRQUNPLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBRTNDOzs7O1dBSUc7UUFDTyxXQUFNLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUcyQixJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFBQyxDQUFDO0lBRTNHLFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELFdBQVcsQ0FBQyxFQUFDLFNBQVMsRUFBZ0I7UUFDcEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyRDtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsTUFBTSxDQUFDLE9BQWdCLElBQUksQ0FBQyxTQUFTO1FBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBRU8sY0FBYyxDQUFDLFNBQWtCLEVBQUUsU0FBa0IsRUFBRSxTQUFTLEdBQUcsSUFBSTtRQUM3RSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSx1QkFBdUIsRUFBRTtZQUNyRSxTQUFTO1lBQ1QsaUJBQWlCLEVBQUUsTUFBTTtZQUN6QixPQUFPLEVBQUUsRUFBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBQztTQUNsRCxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNoQixJQUFJLFNBQVMsRUFBRTtnQkFDYixJQUFJLFNBQVMsRUFBRTtvQkFDYixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNwQjtxQkFBTTtvQkFDTCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUNuQjthQUNGO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUEzRUYsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFDOzs7WUFmN0QsVUFBVTtZQVVKLGlCQUFpQjs7O3dCQWV0QixLQUFLO3dCQUtMLEtBQUssU0FBQyxhQUFhO2dDQUVuQixNQUFNO29CQU9OLE1BQU07cUJBT04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge25nYlJ1blRyYW5zaXRpb259IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JUcmFuc2l0aW9uJztcbmltcG9ydCB7bmdiQ29sbGFwc2luZ1RyYW5zaXRpb259IGZyb20gJy4uL3V0aWwvdHJhbnNpdGlvbi9uZ2JDb2xsYXBzZVRyYW5zaXRpb24nO1xuaW1wb3J0IHtOZ2JDb2xsYXBzZUNvbmZpZ30gZnJvbSAnLi9jb2xsYXBzZS1jb25maWcnO1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRvIHByb3ZpZGUgYSBzaW1wbGUgd2F5IG9mIGhpZGluZyBhbmQgc2hvd2luZyBlbGVtZW50cyBvbiB0aGUgcGFnZS5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiQ29sbGFwc2VdJywgZXhwb3J0QXM6ICduZ2JDb2xsYXBzZSd9KVxuZXhwb3J0IGNsYXNzIE5nYkNvbGxhcHNlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAvKipcbiAgICogSWYgYHRydWVgLCBjb2xsYXBzZSB3aWxsIGJlIGFuaW1hdGVkLlxuICAgKlxuICAgKiBBbmltYXRpb24gaXMgdHJpZ2dlcmVkIG9ubHkgd2hlbiBjbGlja2VkIG9uIHRyaWdnZXJpbmcgZWxlbWVudFxuICAgKiBvciB2aWEgdGhlIGAudG9nZ2xlKClgIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQElucHV0KCkgYW5pbWF0aW9uID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgd2lsbCBjb2xsYXBzZSB0aGUgZWxlbWVudCBvciBzaG93IGl0IG90aGVyd2lzZS5cbiAgICovXG4gIEBJbnB1dCgnbmdiQ29sbGFwc2UnKSBjb2xsYXBzZWQgPSBmYWxzZTtcblxuICBAT3V0cHV0KCkgbmdiQ29sbGFwc2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY29sbGFwc2UgZWxlbWVudCBpcyBzaG93biwgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uIEl0IGhhcyBubyBwYXlsb2FkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBjb2xsYXBzZSBlbGVtZW50IGlzIGhpZGRlbiwgYWZ0ZXIgdGhlIHRyYW5zaXRpb24uIEl0IGhhcyBubyBwYXlsb2FkLlxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmLCBjb25maWc6IE5nYkNvbGxhcHNlQ29uZmlnKSB7IHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdjb2xsYXBzZScpO1xuICAgIHRoaXMuX3J1blRyYW5zaXRpb24odGhpcy5jb2xsYXBzZWQsIGZhbHNlLCBmYWxzZSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyh7Y29sbGFwc2VkfTogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmICghY29sbGFwc2VkLmZpcnN0Q2hhbmdlKSB7XG4gICAgICB0aGlzLl9ydW5UcmFuc2l0aW9uKHRoaXMuY29sbGFwc2VkLCB0aGlzLmFuaW1hdGlvbik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRyaWdnZXJzIGNvbGxhcHNpbmcgcHJvZ3JhbW1hdGljYWxseS5cbiAgICpcbiAgICogSWYgdGhlcmUgaXMgYSBjb2xsYXBzaW5nIHRyYW5zaXRpb24gcnVubmluZyBhbHJlYWR5LCBpdCB3aWxsIGJlIHJldmVyc2VkLlxuICAgKiBJZiB0aGUgYW5pbWF0aW9ucyBhcmUgdHVybmVkIG9mZiB0aGlzIGhhcHBlbnMgc3luY2hyb25vdXNseS5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICB0b2dnbGUob3BlbjogYm9vbGVhbiA9IHRoaXMuY29sbGFwc2VkKSB7XG4gICAgdGhpcy5jb2xsYXBzZWQgPSAhb3BlbjtcbiAgICB0aGlzLm5nYkNvbGxhcHNlQ2hhbmdlLm5leHQodGhpcy5jb2xsYXBzZWQpO1xuICAgIHRoaXMuX3J1blRyYW5zaXRpb24odGhpcy5jb2xsYXBzZWQsIHRoaXMuYW5pbWF0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgX3J1blRyYW5zaXRpb24oY29sbGFwc2VkOiBib29sZWFuLCBhbmltYXRpb246IGJvb2xlYW4sIGVtaXRFdmVudCA9IHRydWUpIHtcbiAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgbmdiQ29sbGFwc2luZ1RyYW5zaXRpb24sIHtcbiAgICAgIGFuaW1hdGlvbixcbiAgICAgIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCcsXG4gICAgICBjb250ZXh0OiB7ZGlyZWN0aW9uOiBjb2xsYXBzZWQgPyAnaGlkZScgOiAnc2hvdyd9XG4gICAgfSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmIChlbWl0RXZlbnQpIHtcbiAgICAgICAgaWYgKGNvbGxhcHNlZCkge1xuICAgICAgICAgIHRoaXMuaGlkZGVuLmVtaXQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNob3duLmVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=