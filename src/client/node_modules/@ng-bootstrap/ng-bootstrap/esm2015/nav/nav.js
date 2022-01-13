import { Attribute, ChangeDetectorRef, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Inject, Input, Output, TemplateRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { isDefined } from '../util/util';
import { NgbNavConfig } from './nav-config';
import { Key } from '../util/key';
const isValidNavId = (id) => isDefined(id) && id !== '';
const ɵ0 = isValidNavId;
let navCounter = 0;
/**
 * This directive must be used to wrap content to be displayed in the nav.
 *
 * @since 5.2.0
 */
export class NgbNavContent {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbNavContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbNavContent]' },] }
];
NgbNavContent.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * The directive used to group nav link and related nav content. As well as set nav identifier and some options.
 *
 * @since 5.2.0
 */
export class NgbNavItem {
    constructor(nav, elementRef) {
        this.elementRef = elementRef;
        /**
         * If `true`, the current nav item is disabled and can't be toggled by user.
         *
         * Nevertheless disabled nav can be selected programmatically via the `.select()` method and the `[activeId]` binding.
         */
        this.disabled = false;
        /**
         * An event emitted when the fade in transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished on the related nav content
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        // TODO: cf https://github.com/angular/angular/issues/30106
        this._nav = nav;
    }
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContentChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.contentTpl = this.contentTpls.first;
    }
    ngOnInit() {
        if (!isDefined(this.domId)) {
            this.domId = `ngb-nav-${navCounter++}`;
        }
    }
    get active() { return this._nav.activeId === this.id; }
    get id() { return isValidNavId(this._id) ? this._id : this.domId; }
    get panelDomId() { return `${this.domId}-panel`; }
    isPanelInDom() {
        return (isDefined(this.destroyOnHide) ? !this.destroyOnHide : !this._nav.destroyOnHide) || this.active;
    }
}
NgbNavItem.decorators = [
    { type: Directive, args: [{ selector: '[ngbNavItem]', exportAs: 'ngbNavItem', host: { '[class.nav-item]': 'true' } },] }
];
NgbNavItem.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbNav),] }] },
    { type: ElementRef }
];
NgbNavItem.propDecorators = {
    destroyOnHide: [{ type: Input }],
    disabled: [{ type: Input }],
    domId: [{ type: Input }],
    _id: [{ type: Input, args: ['ngbNavItem',] }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }],
    contentTpls: [{ type: ContentChildren, args: [NgbNavContent, { descendants: false },] }]
};
/**
 * A nav directive that helps with implementing tabbed navigation components.
 *
 * @since 5.2.0
 */
export class NgbNav {
    constructor(role, config, _cd, _document) {
        this.role = role;
        this._cd = _cd;
        this._document = _document;
        /**
         * The event emitted after the active nav changes
         * The payload of the event is the newly active nav id
         *
         * If you want to prevent nav change, you should use `(navChange)` event
         */
        this.activeIdChange = new EventEmitter();
        /**
         * An event emitted when the fade in transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just shown.
         *
         * @since 8.0.0
         */
        this.shown = new EventEmitter();
        /**
         * An event emitted when the fade out transition is finished for one of the items.
         *
         * Payload of the event is the nav id that was just hidden.
         *
         * @since 8.0.0
         */
        this.hidden = new EventEmitter();
        this.navItemChange$ = new Subject();
        /**
         * The nav change event emitted right before the nav change happens on user click.
         *
         * This event won't be emitted if nav is changed programmatically via `[activeId]` or `.select()`.
         *
         * See [`NgbNavChangeEvent`](#/components/nav/api#NgbNavChangeEvent) for payload details.
         */
        this.navChange = new EventEmitter();
        this.animation = config.animation;
        this.destroyOnHide = config.destroyOnHide;
        this.orientation = config.orientation;
        this.roles = config.roles;
        this.keyboard = config.keyboard;
    }
    click(item) {
        if (!item.disabled) {
            this._updateActiveId(item.id);
        }
    }
    onKeyDown(event) {
        if (this.roles !== 'tablist' || !this.keyboard) {
            return;
        }
        // tslint:disable-next-line: deprecation
        const key = event.which;
        const enabledLinks = this.links.filter(link => !link.navItem.disabled);
        const { length } = enabledLinks;
        let position = -1;
        enabledLinks.forEach((link, index) => {
            if (link.elRef.nativeElement === this._document.activeElement) {
                position = index;
            }
        });
        if (length) {
            switch (key) {
                case Key.ArrowLeft:
                    if (this.orientation === 'vertical') {
                        return;
                    }
                    position = (position - 1 + length) % length;
                    break;
                case Key.ArrowRight:
                    if (this.orientation === 'vertical') {
                        return;
                    }
                    position = (position + 1) % length;
                    break;
                case Key.ArrowDown:
                    if (this.orientation === 'horizontal') {
                        return;
                    }
                    position = (position + 1) % length;
                    break;
                case Key.ArrowUp:
                    if (this.orientation === 'horizontal') {
                        return;
                    }
                    position = (position - 1 + length) % length;
                    break;
                case Key.Home:
                    position = 0;
                    break;
                case Key.End:
                    position = length - 1;
                    break;
            }
            if (this.keyboard === 'changeWithArrows') {
                this.select(enabledLinks[position].navItem.id);
            }
            enabledLinks[position].elRef.nativeElement.focus();
            event.preventDefault();
        }
    }
    /**
     * Selects the nav with the given id and shows its associated pane.
     * Any other nav that was previously selected becomes unselected and its associated pane is hidden.
     */
    select(id) { this._updateActiveId(id, false); }
    ngAfterContentInit() {
        if (!isDefined(this.activeId)) {
            const nextId = this.items.first ? this.items.first.id : null;
            if (isValidNavId(nextId)) {
                this._updateActiveId(nextId, false);
                this._cd.detectChanges();
            }
        }
    }
    ngOnChanges({ activeId }) {
        if (activeId && !activeId.firstChange) {
            this._notifyItemChanged(activeId.currentValue);
        }
    }
    _updateActiveId(nextId, emitNavChange = true) {
        if (this.activeId !== nextId) {
            let defaultPrevented = false;
            if (emitNavChange) {
                this.navChange.emit({ activeId: this.activeId, nextId, preventDefault: () => { defaultPrevented = true; } });
            }
            if (!defaultPrevented) {
                this.activeId = nextId;
                this.activeIdChange.emit(nextId);
                this._notifyItemChanged(nextId);
            }
        }
    }
    _notifyItemChanged(nextItemId) { this.navItemChange$.next(this._getItemById(nextItemId)); }
    _getItemById(itemId) {
        return this.items && this.items.find(item => item.id === itemId) || null;
    }
}
NgbNav.decorators = [
    { type: Directive, args: [{
                selector: '[ngbNav]',
                exportAs: 'ngbNav',
                host: {
                    '[class.nav]': 'true',
                    '[class.flex-column]': `orientation === 'vertical'`,
                    '[attr.aria-orientation]': `orientation === 'vertical' && roles === 'tablist' ? 'vertical' : undefined`,
                    '[attr.role]': `role ? role : roles ? 'tablist' : undefined`,
                    '(keydown.arrowLeft)': 'onKeyDown($event)',
                    '(keydown.arrowRight)': 'onKeyDown($event)',
                    '(keydown.arrowDown)': 'onKeyDown($event)',
                    '(keydown.arrowUp)': 'onKeyDown($event)',
                    '(keydown.Home)': 'onKeyDown($event)',
                    '(keydown.End)': 'onKeyDown($event)'
                }
            },] }
];
NgbNav.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
    { type: NgbNavConfig },
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbNav.propDecorators = {
    activeId: [{ type: Input }],
    activeIdChange: [{ type: Output }],
    animation: [{ type: Input }],
    destroyOnHide: [{ type: Input }],
    orientation: [{ type: Input }],
    roles: [{ type: Input }],
    keyboard: [{ type: Input }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }],
    items: [{ type: ContentChildren, args: [NgbNavItem,] }],
    links: [{ type: ContentChildren, args: [forwardRef(() => NgbNavLink), { descendants: true },] }],
    navChange: [{ type: Output }]
};
/**
 * A directive to put on the nav link.
 *
 * @since 5.2.0
 */
export class NgbNavLink {
    constructor(role, navItem, nav, elRef) {
        this.role = role;
        this.navItem = navItem;
        this.nav = nav;
        this.elRef = elRef;
    }
    hasNavItemClass() {
        // with alternative markup we have to add `.nav-item` class, because `ngbNavItem` is on the ng-container
        return this.navItem.elementRef.nativeElement.nodeType === Node.COMMENT_NODE;
    }
}
NgbNavLink.decorators = [
    { type: Directive, args: [{
                selector: 'a[ngbNavLink]',
                host: {
                    '[id]': 'navItem.domId',
                    '[class.nav-link]': 'true',
                    '[class.nav-item]': 'hasNavItemClass()',
                    '[attr.role]': `role ? role : nav.roles ? 'tab' : undefined`,
                    'href': '',
                    '[class.active]': 'navItem.active',
                    '[class.disabled]': 'navItem.disabled',
                    '[attr.tabindex]': 'navItem.disabled ? -1 : undefined',
                    '[attr.aria-controls]': 'navItem.isPanelInDom() ? navItem.panelDomId : null',
                    '[attr.aria-selected]': 'navItem.active',
                    '[attr.aria-disabled]': 'navItem.disabled',
                    '(click)': 'nav.click(navItem); $event.preventDefault()'
                }
            },] }
];
NgbNavLink.ctorParameters = () => [
    { type: String, decorators: [{ type: Attribute, args: ['role',] }] },
    { type: NgbNavItem },
    { type: NgbNav },
    { type: ElementRef }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL25hdi9uYXYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUdMLFNBQVMsRUFDVCxpQkFBaUIsRUFDakIsZUFBZSxFQUNmLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUVMLE1BQU0sRUFHTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFFN0IsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFaEMsTUFBTSxZQUFZLEdBQUcsQ0FBQyxFQUFPLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDOztBQUU3RCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFpQm5COzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQUN4QixZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7SUFBRyxDQUFDOzs7WUFGckQsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFDOzs7WUFsQ2pELFdBQVc7O0FBd0NiOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sVUFBVTtJQW1EckIsWUFBOEMsR0FBRyxFQUFTLFVBQTJCO1FBQTNCLGVBQVUsR0FBVixVQUFVLENBQWlCO1FBMUNyRjs7OztXQUlHO1FBQ00sYUFBUSxHQUFHLEtBQUssQ0FBQztRQW1CMUI7Ozs7V0FJRztRQUNPLFVBQUssR0FBRyxJQUFJLFlB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QUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQzt3QkFxQmpFLE1BQU07O0FBaUhUOzs7O0dBSUc7QUFrQkgsTUFBTSxPQUFPLFVBQVU7SUFDckIsWUFDOEIsSUFBWSxFQUFTLE9BQW1CLEVBQVMsR0FBVyxFQUMvRSxLQUFpQjtRQURFLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxZQUFPLEdBQVAsT0FBTyxDQUFZO1FBQVMsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUMvRSxVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQUcsQ0FBQztJQUVoQyxlQUFlO1FBQ2Isd0dBQXdHO1FBQ3hHLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzlFLENBQUM7OztZQXpCRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLElBQUksRUFBRTtvQkFDSixNQUFNLEVBQUUsZUFBZTtvQkFDdkIsa0JBQWtCLEVBQUUsTUFBTTtvQkFDMUIsa0JBQWtCLEVBQUUsbUJBQW1CO29CQUN2QyxhQUFhLEVBQUUsNkNBQTZDO29CQUM1RCxNQUFNLEVBQUUsRUFBRTtvQkFDVixnQkFBZ0IsRUFBRSxnQkFBZ0I7b0JBQ2xDLGtCQUFrQixFQUFFLGtCQUFrQjtvQkFDdEMsaUJBQWlCLEVBQUUsbUNBQW1DO29CQUN0RCxzQkFBc0IsRUFBRSxvREFBb0Q7b0JBQzVFLHNCQUFzQixFQUFFLGdCQUFnQjtvQkFDeEMsc0JBQXNCLEVBQUUsa0JBQWtCO29CQUMxQyxTQUFTLEVBQUUsNkNBQTZDO2lCQUN6RDthQUNGOzs7eUNBR00sU0FBUyxTQUFDLE1BQU07WUFBdUMsVUFBVTtZQUFjLE1BQU07WUExWTFGLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlckNvbnRlbnRJbml0LFxuICBBdHRyaWJ1dGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZlxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7U3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7aXNEZWZpbmVkfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JOYXZDb25maWd9IGZyb20gJy4vbmF2LWNvbmZpZyc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5jb25zdCBpc1ZhbGlkTmF2SWQgPSAoaWQ6IGFueSkgPT4gaXNEZWZpbmVkKGlkKSAmJiBpZCAhPT0gJyc7XG5cbmxldCBuYXZDb3VudGVyID0gMDtcblxuLyoqXG4gKiBDb250ZXh0IHBhc3NlZCB0byB0aGUgbmF2IGNvbnRlbnQgdGVtcGxhdGUuXG4gKlxuICogU2VlIFt0aGlzIGRlbW9dKCMvY29tcG9uZW50cy9uYXYvZXhhbXBsZXMja2VlcC1jb250ZW50KSBhcyB0aGUgZXhhbXBsZS5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JOYXZDb250ZW50Q29udGV4dCB7XG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIGN1cnJlbnQgbmF2IGNvbnRlbnQgaXMgdmlzaWJsZSBhbmQgYWN0aXZlXG4gICAqL1xuICAkaW1wbGljaXQ6IGJvb2xlYW47XG59XG5cblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBtdXN0IGJlIHVzZWQgdG8gd3JhcCBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgbmF2LlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYk5hdkNvbnRlbnRdJ30pXG5leHBvcnQgY2xhc3MgTmdiTmF2Q29udGVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuXG4vKipcbiAqIFRoZSBkaXJlY3RpdmUgdXNlZCB0byBncm91cCBuYXYgbGluayBhbmQgcmVsYXRlZCBuYXYgY29udGVudC4gQXMgd2VsbCBhcyBzZXQgbmF2IGlkZW50aWZpZXIgYW5kIHNvbWUgb3B0aW9ucy5cbiAqXG4gKiBAc2luY2UgNS4yLjBcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiTmF2SXRlbV0nLCBleHBvcnRBczogJ25nYk5hdkl0ZW0nLCBob3N0OiB7J1tjbGFzcy5uYXYtaXRlbV0nOiAndHJ1ZSd9fSlcbmV4cG9ydCBjbGFzcyBOZ2JOYXZJdGVtIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25Jbml0IHtcbiAgcHJpdmF0ZSBfbmF2OiBOZ2JOYXY7XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbm9uLWFjdGl2ZSBjdXJyZW50IG5hdiBpdGVtIGNvbnRlbnQgd2lsbCBiZSByZW1vdmVkIGZyb20gRE9NXG4gICAqIE90aGVyd2lzZSBpdCB3aWxsIGp1c3QgYmUgaGlkZGVuXG4gICAqL1xuICBASW5wdXQoKSBkZXN0cm95T25IaWRlO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIHRoZSBjdXJyZW50IG5hdiBpdGVtIGlzIGRpc2FibGVkIGFuZCBjYW4ndCBiZSB0b2dnbGVkIGJ5IHVzZXIuXG4gICAqXG4gICAqIE5ldmVydGhlbGVzcyBkaXNhYmxlZCBuYXYgY2FuIGJlIHNlbGVjdGVkIHByb2dyYW1tYXRpY2FsbHkgdmlhIHRoZSBgLnNlbGVjdCgpYCBtZXRob2QgYW5kIHRoZSBgW2FjdGl2ZUlkXWAgYmluZGluZy5cbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFRoZSBpZCB1c2VkIGZvciB0aGUgRE9NIGVsZW1lbnRzLlxuICAgKiBNdXN0IGJlIHVuaXF1ZSBpbnNpZGUgdGhlIGRvY3VtZW50IGluIGNhc2UgeW91IGhhdmUgbXVsdGlwbGUgYG5nYk5hdmBzIG9uIHRoZSBwYWdlLlxuICAgKlxuICAgKiBBdXRvZ2VuZXJhdGVkIGFzIGBuZ2ItbmF2LVhYWGAgaWYgbm90IHByb3ZpZGVkLlxuICAgKi9cbiAgQElucHV0KCkgZG9tSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGlkIHVzZWQgYXMgYSBtb2RlbCBmb3IgYWN0aXZlIG5hdi5cbiAgICogSXQgY2FuIGJlIGFueXRoaW5nLCBidXQgbXVzdCBiZSB1bmlxdWUgaW5zaWRlIG9uZSBgbmdiTmF2YC5cbiAgICpcbiAgICogVGhlIG9ubHkgbGltaXRhdGlvbiBpcyB0aGF0IGl0IGlzIG5vdCBwb3NzaWJsZSB0byBoYXZlIHRoZSBgJydgIChlbXB0eSBzdHJpbmcpIGFzIGlkLFxuICAgKiBiZWNhdXNlIGAgbmdiTmF2SXRlbSBgLCBgbmdiTmF2SXRlbT0nJ2AgYW5kIGBbbmdiTmF2SXRlbV09XCInJ1wiYCBhcmUgaW5kaXN0aW5ndWlzaGFibGVcbiAgICovXG4gIEBJbnB1dCgnbmdiTmF2SXRlbScpIF9pZDogYW55O1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBlbWl0dGVkIHdoZW4gdGhlIGZhZGUgaW4gdHJhbnNpdGlvbiBpcyBmaW5pc2hlZCBvbiB0aGUgcmVsYXRlZCBuYXYgY29udGVudFxuICAgKlxuICAgKiBAc2luY2UgOC4wLjBcbiAgICovXG4gIEBPdXRwdXQoKSBzaG93biA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZW1pdHRlZCB3aGVuIHRoZSBmYWRlIG91dCB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIG9uIHRoZSByZWxhdGVkIG5hdiBjb250ZW50XG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb250ZW50VHBsOiBOZ2JOYXZDb250ZW50IHwgbnVsbDtcblxuICBAQ29udGVudENoaWxkcmVuKE5nYk5hdkNvbnRlbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBjb250ZW50VHBsczogUXVlcnlMaXN0PE5nYk5hdkNvbnRlbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JOYXYpKSBuYXYsIHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmPGFueT4pIHtcbiAgICAvLyBUT0RPOiBjZiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8zMDEwNlxuICAgIHRoaXMuX25hdiA9IG5hdjtcbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250ZW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG4gICAgLy8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG4gICAgLy8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuICAgIHRoaXMuY29udGVudFRwbCA9IHRoaXMuY29udGVudFRwbHMuZmlyc3Q7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAoIWlzRGVmaW5lZCh0aGlzLmRvbUlkKSkge1xuICAgICAgdGhpcy5kb21JZCA9IGBuZ2ItbmF2LSR7bmF2Q291bnRlcisrfWA7XG4gICAgfVxuICB9XG5cbiAgZ2V0IGFjdGl2ZSgpIHsgcmV0dXJuIHRoaXMuX25hdi5hY3RpdmVJZCA9PT0gdGhpcy5pZDsgfVxuXG4gIGdldCBpZCgpIHsgcmV0dXJuIGlzVmFsaWROYXZJZCh0aGlzLl9pZCkgPyB0aGlzLl9pZCA6IHRoaXMuZG9tSWQ7IH1cblxuICBnZXQgcGFuZWxEb21JZCgpIHsgcmV0dXJuIGAke3RoaXMuZG9tSWR9LXBhbmVsYDsgfVxuXG4gIGlzUGFuZWxJbkRvbSgpIHtcbiAgICByZXR1cm4gKGlzRGVmaW5lZCh0aGlzLmRlc3Ryb3lPbkhpZGUpID8gIXRoaXMuZGVzdHJveU9uSGlkZSA6ICF0aGlzLl9uYXYuZGVzdHJveU9uSGlkZSkgfHwgdGhpcy5hY3RpdmU7XG4gIH1cbn1cblxuXG4vKipcbiAqIEEgbmF2IGRpcmVjdGl2ZSB0aGF0IGhlbHBzIHdpdGggaW1wbGVtZW50aW5nIHRhYmJlZCBuYXZpZ2F0aW9uIGNvbXBvbmVudHMuXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuZ2JOYXZdJyxcbiAgZXhwb3J0QXM6ICduZ2JOYXYnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5uYXZdJzogJ3RydWUnLFxuICAgICdbY2xhc3MuZmxleC1jb2x1bW5dJzogYG9yaWVudGF0aW9uID09PSAndmVydGljYWwnYCxcbiAgICAnW2F0dHIuYXJpYS1vcmllbnRhdGlvbl0nOiBgb3JpZW50YXRpb24gPT09ICd2ZXJ0aWNhbCcgJiYgcm9sZXMgPT09ICd0YWJsaXN0JyA/ICd2ZXJ0aWNhbCcgOiB1bmRlZmluZWRgLFxuICAgICdbYXR0ci5yb2xlXSc6IGByb2xlID8gcm9sZSA6IHJvbGVzID8gJ3RhYmxpc3QnIDogdW5kZWZpbmVkYCxcbiAgICAnKGtleWRvd24uYXJyb3dMZWZ0KSc6ICdvbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLmFycm93UmlnaHQpJzogJ29uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uYXJyb3dEb3duKSc6ICdvbktleURvd24oJGV2ZW50KScsXG4gICAgJyhrZXlkb3duLmFycm93VXApJzogJ29uS2V5RG93bigkZXZlbnQpJyxcbiAgICAnKGtleWRvd24uSG9tZSknOiAnb25LZXlEb3duKCRldmVudCknLFxuICAgICcoa2V5ZG93bi5FbmQpJzogJ29uS2V5RG93bigkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfb3JpZW50YXRpb246IHN0cmluZztcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3JvbGVzOiBib29sZWFuIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWQgb2YgdGhlIG5hdiB0aGF0IHNob3VsZCBiZSBhY3RpdmVcbiAgICpcbiAgICogWW91IGNvdWxkIGFsc28gdXNlIHRoZSBgLnNlbGVjdCgpYCBtZXRob2QgYW5kIHRoZSBgKG5hdkNoYW5nZSlgIGV2ZW50XG4gICAqL1xuICBASW5wdXQoKSBhY3RpdmVJZDogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgZXZlbnQgZW1pdHRlZCBhZnRlciB0aGUgYWN0aXZlIG5hdiBjaGFuZ2VzXG4gICAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyB0aGUgbmV3bHkgYWN0aXZlIG5hdiBpZFxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBwcmV2ZW50IG5hdiBjaGFuZ2UsIHlvdSBzaG91bGQgdXNlIGAobmF2Q2hhbmdlKWAgZXZlbnRcbiAgICovXG4gIEBPdXRwdXQoKSBhY3RpdmVJZENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gIC8qKlxuICAgKiBJZiBgdHJ1ZWAsIG5hdiBjaGFuZ2Ugd2lsbCBiZSBhbmltYXRlZC5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBASW5wdXQoKSBhbmltYXRpb246IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIElmIGB0cnVlYCwgbm9uLWFjdGl2ZSBuYXYgY29udGVudCB3aWxsIGJlIHJlbW92ZWQgZnJvbSBET01cbiAgICogT3RoZXJ3aXNlIGl0IHdpbGwganVzdCBiZSBoaWRkZW5cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGU7XG5cbiAgLyoqXG4gICAqIFRoZSBvcmllbnRhdGlvbiBvZiBuYXZzLlxuICAgKlxuICAgKiBVc2luZyBgdmVydGljYWxgIHdpbGwgYWxzbyBhZGQgdGhlIGBhcmlhLW9yaWVudGF0aW9uYCBhdHRyaWJ1dGVcbiAgICovXG4gIEBJbnB1dCgpIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnO1xuXG4gIC8qKlxuICAgKiBSb2xlIGF0dHJpYnV0ZSBnZW5lcmF0aW5nIHN0cmF0ZWd5OlxuICAgKiAtIGBmYWxzZWAgLSBubyByb2xlIGF0dHJpYnV0ZXMgd2lsbCBiZSBnZW5lcmF0ZWRcbiAgICogLSBgJ3RhYmxpc3QnYCAtICd0YWJsaXN0JywgJ3RhYicgYW5kICd0YWJwYW5lbCcgd2lsbCBiZSBnZW5lcmF0ZWQgKGRlZmF1bHQpXG4gICAqL1xuICBASW5wdXQoKSByb2xlczogJ3RhYmxpc3QnIHwgZmFsc2U7XG5cbiAgLyoqXG4gICAqIEtleWJvYXJkIHN1cHBvcnQgZm9yIG5hdiBmb2N1cy9zZWxlY3Rpb24gdXNpbmcgYXJyb3cga2V5cy5cbiAgICpcbiAgICogKiBgZmFsc2VgIC0gbm8ga2V5Ym9hcmQgc3VwcG9ydC5cbiAgICogKiBgdHJ1ZWAgLSBuYXZzIHdpbGwgYmUgZm9jdXNlZCB1c2luZyBrZXlib2FyZCBhcnJvdyBrZXlzXG4gICAqICogYCdjaGFuZ2VXaXRoQXJyb3dzJ2AgLSAgbmF2IHdpbGwgYmUgc2VsZWN0ZWQgdXNpbmcga2V5Ym9hcmQgYXJyb3cga2V5c1xuICAgKlxuICAgKiBTZWUgdGhlIFtsaXN0IG9mIGF2YWlsYWJsZSBrZXlib2FyZCBzaG9ydGN1dHNdKCMvY29tcG9uZW50cy9uYXYvb3ZlcnZpZXcja2V5Ym9hcmQtc2hvcnRjdXRzKS5cbiAgICpcbiAgICogQHNpbmNlIDYuMS4wXG4gKi9cbiAgQElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW4gfCAnY2hhbmdlV2l0aEFycm93cyc7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZmFkZSBpbiB0cmFuc2l0aW9uIGlzIGZpbmlzaGVkIGZvciBvbmUgb2YgdGhlIGl0ZW1zLlxuICAgKlxuICAgKiBQYXlsb2FkIG9mIHRoZSBldmVudCBpcyB0aGUgbmF2IGlkIHRoYXQgd2FzIGp1c3Qgc2hvd24uXG4gICAqXG4gICAqIEBzaW5jZSA4LjAuMFxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgZmFkZSBvdXQgdHJhbnNpdGlvbiBpcyBmaW5pc2hlZCBmb3Igb25lIG9mIHRoZSBpdGVtcy5cbiAgICpcbiAgICogUGF5bG9hZCBvZiB0aGUgZXZlbnQgaXMgdGhlIG5hdiBpZCB0aGF0IHdhcyBqdXN0IGhpZGRlbi5cbiAgICpcbiAgICogQHNpbmNlIDguMC4wXG4gICAqL1xuICBAT3V0cHV0KCkgaGlkZGVuID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JOYXZJdGVtKSBpdGVtczogUXVlcnlMaXN0PE5nYk5hdkl0ZW0+O1xuICBAQ29udGVudENoaWxkcmVuKGZvcndhcmRSZWYoKCkgPT4gTmdiTmF2TGluayksIHtkZXNjZW5kYW50czogdHJ1ZX0pIGxpbmtzOiBRdWVyeUxpc3Q8TmdiTmF2TGluaz47XG5cbiAgbmF2SXRlbUNoYW5nZSQgPSBuZXcgU3ViamVjdDxOZ2JOYXZJdGVtIHwgbnVsbD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBBdHRyaWJ1dGUoJ3JvbGUnKSBwdWJsaWMgcm9sZTogc3RyaW5nLCBjb25maWc6IE5nYk5hdkNvbmZpZywgcHJpdmF0ZSBfY2Q6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSkge1xuICAgIHRoaXMuYW5pbWF0aW9uID0gY29uZmlnLmFuaW1hdGlvbjtcbiAgICB0aGlzLmRlc3Ryb3lPbkhpZGUgPSBjb25maWcuZGVzdHJveU9uSGlkZTtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gY29uZmlnLm9yaWVudGF0aW9uO1xuICAgIHRoaXMucm9sZXMgPSBjb25maWcucm9sZXM7XG4gICAgdGhpcy5rZXlib2FyZCA9IGNvbmZpZy5rZXlib2FyZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmF2IGNoYW5nZSBldmVudCBlbWl0dGVkIHJpZ2h0IGJlZm9yZSB0aGUgbmF2IGNoYW5nZSBoYXBwZW5zIG9uIHVzZXIgY2xpY2suXG4gICAqXG4gICAqIFRoaXMgZXZlbnQgd29uJ3QgYmUgZW1pdHRlZCBpZiBuYXYgaXMgY2hhbmdlZCBwcm9ncmFtbWF0aWNhbGx5IHZpYSBgW2FjdGl2ZUlkXWAgb3IgYC5zZWxlY3QoKWAuXG4gICAqXG4gICAqIFNlZSBbYE5nYk5hdkNoYW5nZUV2ZW50YF0oIy9jb21wb25lbnRzL25hdi9hcGkjTmdiTmF2Q2hhbmdlRXZlbnQpIGZvciBwYXlsb2FkIGRldGFpbHMuXG4gICAqL1xuICBAT3V0cHV0KCkgbmF2Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JOYXZDaGFuZ2VFdmVudD4oKTtcblxuICBjbGljayhpdGVtOiBOZ2JOYXZJdGVtKSB7XG4gICAgaWYgKCFpdGVtLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl91cGRhdGVBY3RpdmVJZChpdGVtLmlkKTtcbiAgICB9XG4gIH1cblxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgICBpZiAodGhpcy5yb2xlcyAhPT0gJ3RhYmxpc3QnIHx8ICF0aGlzLmtleWJvYXJkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZGVwcmVjYXRpb25cbiAgICBjb25zdCBrZXkgPSBldmVudC53aGljaDtcbiAgICBjb25zdCBlbmFibGVkTGlua3MgPSB0aGlzLmxpbmtzLmZpbHRlcihsaW5rID0+ICFsaW5rLm5hdkl0ZW0uZGlzYWJsZWQpO1xuICAgIGNvbnN0IHtsZW5ndGh9ID0gZW5hYmxlZExpbmtzO1xuXG4gICAgbGV0IHBvc2l0aW9uID0gLTE7XG5cbiAgICBlbmFibGVkTGlua3MuZm9yRWFjaCgobGluaywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChsaW5rLmVsUmVmLm5hdGl2ZUVsZW1lbnQgPT09IHRoaXMuX2RvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpbmRleDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChsZW5ndGgpIHtcbiAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2UgS2V5LkFycm93TGVmdDpcbiAgICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb3NpdGlvbiA9IChwb3NpdGlvbiAtIDEgKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd1JpZ2h0OlxuICAgICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvc2l0aW9uID0gKHBvc2l0aW9uICsgMSkgJSBsZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHBvc2l0aW9uID0gKHBvc2l0aW9uICsgMSkgJSBsZW5ndGg7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93VXA6XG4gICAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBwb3NpdGlvbiA9IChwb3NpdGlvbiAtIDEgKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHBvc2l0aW9uID0gMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuRW5kOlxuICAgICAgICAgIHBvc2l0aW9uID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmtleWJvYXJkID09PSAnY2hhbmdlV2l0aEFycm93cycpIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoZW5hYmxlZExpbmtzW3Bvc2l0aW9uXS5uYXZJdGVtLmlkKTtcbiAgICAgIH1cbiAgICAgIGVuYWJsZWRMaW5rc1twb3NpdGlvbl0uZWxSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZWxlY3RzIHRoZSBuYXYgd2l0aCB0aGUgZ2l2ZW4gaWQgYW5kIHNob3dzIGl0cyBhc3NvY2lhdGVkIHBhbmUuXG4gICAqIEFueSBvdGhlciBuYXYgdGhhdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCBiZWNvbWVzIHVuc2VsZWN0ZWQgYW5kIGl0cyBhc3NvY2lhdGVkIHBhbmUgaXMgaGlkZGVuLlxuICAgKi9cbiAgc2VsZWN0KGlkOiBhbnkpIHsgdGhpcy5fdXBkYXRlQWN0aXZlSWQoaWQsIGZhbHNlKTsgfVxuXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICBpZiAoIWlzRGVmaW5lZCh0aGlzLmFjdGl2ZUlkKSkge1xuICAgICAgY29uc3QgbmV4dElkID0gdGhpcy5pdGVtcy5maXJzdCA/IHRoaXMuaXRlbXMuZmlyc3QuaWQgOiBudWxsO1xuICAgICAgaWYgKGlzVmFsaWROYXZJZChuZXh0SWQpKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkKG5leHRJZCwgZmFsc2UpO1xuICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoe2FjdGl2ZUlkfTogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChhY3RpdmVJZCAmJiAhYWN0aXZlSWQuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX25vdGlmeUl0ZW1DaGFuZ2VkKGFjdGl2ZUlkLmN1cnJlbnRWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWQobmV4dElkOiBhbnksIGVtaXROYXZDaGFuZ2UgPSB0cnVlKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSWQgIT09IG5leHRJZCkge1xuICAgICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgICAgaWYgKGVtaXROYXZDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5uYXZDaGFuZ2UuZW1pdCh7YWN0aXZlSWQ6IHRoaXMuYWN0aXZlSWQsIG5leHRJZCwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlSWQgPSBuZXh0SWQ7XG4gICAgICAgIHRoaXMuYWN0aXZlSWRDaGFuZ2UuZW1pdChuZXh0SWQpO1xuICAgICAgICB0aGlzLl9ub3RpZnlJdGVtQ2hhbmdlZChuZXh0SWQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX25vdGlmeUl0ZW1DaGFuZ2VkKG5leHRJdGVtSWQ6IGFueSkgeyB0aGlzLm5hdkl0ZW1DaGFuZ2UkLm5leHQodGhpcy5fZ2V0SXRlbUJ5SWQobmV4dEl0ZW1JZCkpOyB9XG5cbiAgcHJpdmF0ZSBfZ2V0SXRlbUJ5SWQoaXRlbUlkOiBhbnkpOiBOZ2JOYXZJdGVtIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMgJiYgdGhpcy5pdGVtcy5maW5kKGl0ZW0gPT4gaXRlbS5pZCA9PT0gaXRlbUlkKSB8fCBudWxsO1xuICB9XG59XG5cblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0byBwdXQgb24gdGhlIG5hdiBsaW5rLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdhW25nYk5hdkxpbmtdJyxcbiAgaG9zdDoge1xuICAgICdbaWRdJzogJ25hdkl0ZW0uZG9tSWQnLFxuICAgICdbY2xhc3MubmF2LWxpbmtdJzogJ3RydWUnLFxuICAgICdbY2xhc3MubmF2LWl0ZW1dJzogJ2hhc05hdkl0ZW1DbGFzcygpJyxcbiAgICAnW2F0dHIucm9sZV0nOiBgcm9sZSA/IHJvbGUgOiBuYXYucm9sZXMgPyAndGFiJyA6IHVuZGVmaW5lZGAsXG4gICAgJ2hyZWYnOiAnJyxcbiAgICAnW2NsYXNzLmFjdGl2ZV0nOiAnbmF2SXRlbS5hY3RpdmUnLFxuICAgICdbY2xhc3MuZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJpbmRleF0nOiAnbmF2SXRlbS5kaXNhYmxlZCA/IC0xIDogdW5kZWZpbmVkJyxcbiAgICAnW2F0dHIuYXJpYS1jb250cm9sc10nOiAnbmF2SXRlbS5pc1BhbmVsSW5Eb20oKSA/IG5hdkl0ZW0ucGFuZWxEb21JZCA6IG51bGwnLFxuICAgICdbYXR0ci5hcmlhLXNlbGVjdGVkXSc6ICduYXZJdGVtLmFjdGl2ZScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ25hdkl0ZW0uZGlzYWJsZWQnLFxuICAgICcoY2xpY2spJzogJ25hdi5jbGljayhuYXZJdGVtKTsgJGV2ZW50LnByZXZlbnREZWZhdWx0KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTmdiTmF2TGluayB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgQEF0dHJpYnV0ZSgncm9sZScpIHB1YmxpYyByb2xlOiBzdHJpbmcsIHB1YmxpYyBuYXZJdGVtOiBOZ2JOYXZJdGVtLCBwdWJsaWMgbmF2OiBOZ2JOYXYsXG4gICAgICBwdWJsaWMgZWxSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgaGFzTmF2SXRlbUNsYXNzKCkge1xuICAgIC8vIHdpdGggYWx0ZXJuYXRpdmUgbWFya3VwIHdlIGhhdmUgdG8gYWRkIGAubmF2LWl0ZW1gIGNsYXNzLCBiZWNhdXNlIGBuZ2JOYXZJdGVtYCBpcyBvbiB0aGUgbmctY29udGFpbmVyXG4gICAgcmV0dXJuIHRoaXMubmF2SXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZVR5cGUgPT09IE5vZGUuQ09NTUVOVF9OT0RFO1xuICB9XG59XG5cblxuLyoqXG4gKiBUaGUgcGF5bG9hZCBvZiB0aGUgY2hhbmdlIGV2ZW50IGVtaXR0ZWQgcmlnaHQgYmVmb3JlIHRoZSBuYXYgY2hhbmdlIGhhcHBlbnMgb24gdXNlciBjbGljay5cbiAqXG4gKiBUaGlzIGV2ZW50IHdvbid0IGJlIGVtaXR0ZWQgaWYgbmF2IGlzIGNoYW5nZWQgcHJvZ3JhbW1hdGljYWxseSB2aWEgYFthY3RpdmVJZF1gIG9yIGAuc2VsZWN0KClgLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYk5hdkNoYW5nZUV2ZW50PFQgPSBhbnk+IHtcbiAgLyoqXG4gICAqIElkIG9mIHRoZSBjdXJyZW50bHkgYWN0aXZlIG5hdi5cbiAgICovXG4gIGFjdGl2ZUlkOiBUO1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgbmV3bHkgc2VsZWN0ZWQgbmF2LlxuICAgKi9cbiAgbmV4dElkOiBUO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgcHJldmVudCBuYXYgY2hhbmdlIGlmIGNhbGxlZC5cbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuIl19