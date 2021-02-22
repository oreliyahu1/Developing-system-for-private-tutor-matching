import { ChangeDetectorRef, Component, Directive, ElementRef, Input, ViewChildren, ViewEncapsulation } from '@angular/core';
import { distinctUntilChanged, skip, startWith } from 'rxjs/operators';
import { ngbNavFadeInNoReflowTransition, ngbNavFadeInTransition, ngbNavFadeOutTransition } from './nav-transition';
import { ngbRunTransition } from '../util/transition/ngbTransition';
export class NgbNavPane {
    constructor(elRef) {
        this.elRef = elRef;
    }
}
NgbNavPane.decorators = [
    { type: Directive, args: [{
                selector: '[ngbNavPane]',
                host: {
                    '[id]': 'item.panelDomId',
                    'class': 'tab-pane',
                    '[class.fade]': 'nav.animation',
                    '[attr.role]': 'role ? role : nav.roles ? "tabpanel" : undefined',
                    '[attr.aria-labelledby]': 'item.domId'
                }
            },] }
];
NgbNavPane.ctorParameters = () => [
    { type: ElementRef }
];
NgbNavPane.propDecorators = {
    item: [{ type: Input }],
    nav: [{ type: Input }],
    role: [{ type: Input }]
};
/**
 * The outlet where currently active nav content will be displayed.
 *
 * @since 5.2.0
 */
export class NgbNavOutlet {
    constructor(_cd) {
        this._cd = _cd;
        this._activePane = null;
    }
    isPanelTransitioning(item) { var _a; return ((_a = this._activePane) === null || _a === void 0 ? void 0 : _a.item) === item; }
    ngAfterViewInit() {
        var _a, _b, _c;
        // initial display
        this._activePane = this._getActivePane();
        (_a = this._activePane) === null || _a === void 0 ? void 0 : _a.elRef.nativeElement.classList.add('show');
        (_b = this._activePane) === null || _b === void 0 ? void 0 : _b.elRef.nativeElement.classList.add('active');
        // this will be emitted for all 3 types of nav changes: .select(), [activeId] or (click)
        this.nav.navItemChange$
            .pipe(startWith(((_c = this._activePane) === null || _c === void 0 ? void 0 : _c.item) || null), distinctUntilChanged(), skip(1))
            .subscribe(nextItem => {
            const options = { animation: this.nav.animation, runningTransition: 'stop' };
            // fading out
            if (this._activePane) {
                ngbRunTransition(this._activePane.elRef.nativeElement, ngbNavFadeOutTransition, options).subscribe(() => {
                    var _a;
                    const activeItem = (_a = this._activePane) === null || _a === void 0 ? void 0 : _a.item;
                    // next panel we're switching to will only appear in DOM after the change detection is done
                    // and `this._panes` will be updated
                    this._cd.detectChanges();
                    this._activePane = this._getPaneForItem(nextItem);
                    // fading in
                    if (this._activePane) {
                        const fadeInTransition = this.nav.animation ? ngbNavFadeInTransition : ngbNavFadeInNoReflowTransition;
                        ngbRunTransition(this._activePane.elRef.nativeElement, fadeInTransition, options).subscribe(() => {
                            if (nextItem) {
                                nextItem.shown.emit();
                                this.nav.shown.emit(nextItem.id);
                            }
                        });
                    }
                    if (activeItem) {
                        activeItem.hidden.emit();
                        this.nav.hidden.emit(activeItem.id);
                    }
                });
            }
        });
    }
    _getPaneForItem(item) {
        return this._panes && this._panes.find(pane => pane.item === item) || null;
    }
    _getActivePane() {
        return this._panes && this._panes.find(pane => pane.item.active) || null;
    }
}
NgbNavOutlet.decorators = [
    { type: Component, args: [{
                selector: '[ngbNavOutlet]',
                host: { '[class.tab-content]': 'true' },
                encapsulation: ViewEncapsulation.None,
                template: `
    <ng-template ngFor let-item [ngForOf]="nav.items">
      <div ngbNavPane *ngIf="item.isPanelInDom() || isPanelTransitioning(item)" [item]="item" [nav]="nav" [role]="paneRole">
        <ng-template [ngTemplateOutlet]="item.contentTpl?.templateRef || null"
                     [ngTemplateOutletContext]="{$implicit: item.active || isPanelTransitioning(item)}"></ng-template>
      </div>
    </ng-template>
  `
            },] }
];
NgbNavOutlet.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
NgbNavOutlet.propDecorators = {
    _panes: [{ type: ViewChildren, args: [NgbNavPane,] }],
    paneRole: [{ type: Input }],
    nav: [{ type: Input, args: ['ngbNavOutlet',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LW91dGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uYXYvbmF2LW91dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFFTCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBQyxvQkFBb0IsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFckUsT0FBTyxFQUFDLDhCQUE4QixFQUFFLHNCQUFzQixFQUFFLHVCQUF1QixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDakgsT0FBTyxFQUFDLGdCQUFnQixFQUF1QixNQUFNLGtDQUFrQyxDQUFDO0FBYXhGLE1BQU0sT0FBTyxVQUFVO0lBS3JCLFlBQW1CLEtBQThCO1FBQTlCLFVBQUssR0FBTCxLQUFLLENBQXlCO0lBQUcsQ0FBQzs7O1lBZnRELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsSUFBSSxFQUFFO29CQUNKLE1BQU0sRUFBRSxpQkFBaUI7b0JBQ3pCLE9BQU8sRUFBRSxVQUFVO29CQUNuQixjQUFjLEVBQUUsZUFBZTtvQkFDL0IsYUFBYSxFQUFFLGtEQUFrRDtvQkFDakUsd0JBQXdCLEVBQUUsWUFBWTtpQkFDdkM7YUFDRjs7O1lBdEJDLFVBQVU7OzttQkF3QlQsS0FBSztrQkFDTCxLQUFLO21CQUNMLEtBQUs7O0FBS1I7Ozs7R0FJRztBQWNILE1BQU0sT0FBTyxZQUFZO0lBZXZCLFlBQW9CLEdBQXNCO1FBQXRCLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBZGxDLGdCQUFXLEdBQXNCLElBQUksQ0FBQztJQWNELENBQUM7SUFFOUMsb0JBQW9CLENBQUMsSUFBZ0IsWUFBSSxPQUFPLE9BQUEsSUFBSSxDQUFDLFdBQVcsMENBQUcsSUFBSSxN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Qzs7O1lBakZGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixJQUFJLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxNQUFNLEVBQUM7Z0JBQ3JDLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUU7Ozs7Ozs7R0FPVDthQUNGOzs7WUFuREMsaUJBQWlCOzs7cUJBdURoQixZQUFZLFNBQUMsVUFBVTt1QkFLdkIsS0FBSztrQkFLTCxLQUFLLFNBQUMsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtkaXN0aW5jdFVudGlsQ2hhbmdlZCwgc2tpcCwgc3RhcnRXaXRofSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bmdiTmF2RmFkZUluTm9SZWZsb3dUcmFuc2l0aW9uLCBuZ2JOYXZGYWRlSW5UcmFuc2l0aW9uLCBuZ2JOYXZGYWRlT3V0VHJhbnNpdGlvbn0gZnJvbSAnLi9uYXYtdHJhbnNpdGlvbic7XG5pbXBvcnQge25nYlJ1blRyYW5zaXRpb24sIE5nYlRyYW5zaXRpb25PcHRpb25zfSBmcm9tICcuLi91dGlsL3RyYW5zaXRpb24vbmdiVHJhbnNpdGlvbic7XG5pbXBvcnQge05nYk5hdiwgTmdiTmF2SXRlbX0gZnJvbSAnLi9uYXYnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiTmF2UGFuZV0nLFxuICBob3N0OiB7XG4gICAgJ1tpZF0nOiAnaXRlbS5wYW5lbERvbUlkJyxcbiAgICAnY2xhc3MnOiAndGFiLXBhbmUnLFxuICAgICdbY2xhc3MuZmFkZV0nOiAnbmF2LmFuaW1hdGlvbicsXG4gICAgJ1thdHRyLnJvbGVdJzogJ3JvbGUgPyByb2xlIDogbmF2LnJvbGVzID8gXCJ0YWJwYW5lbFwiIDogdW5kZWZpbmVkJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdpdGVtLmRvbUlkJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdlBhbmUge1xuICBASW5wdXQoKSBpdGVtOiBOZ2JOYXZJdGVtO1xuICBASW5wdXQoKSBuYXY6IE5nYk5hdjtcbiAgQElucHV0KCkgcm9sZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHt9XG59XG5cbi8qKlxuICogVGhlIG91dGxldCB3aGVyZSBjdXJyZW50bHkgYWN0aXZlIG5hdiBjb250ZW50IHdpbGwgYmUgZGlzcGxheWVkLlxuICpcbiAqIEBzaW5jZSA1LjIuMFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbmdiTmF2T3V0bGV0XScsXG4gIGhvc3Q6IHsnW2NsYXNzLnRhYi1jb250ZW50XSc6ICd0cnVlJ30sXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cIm5hdi5pdGVtc1wiPlxuICAgICAgPGRpdiBuZ2JOYXZQYW5lICpuZ0lmPVwiaXRlbS5pc1BhbmVsSW5Eb20oKSB8fCBpc1BhbmVsVHJhbnNpdGlvbmluZyhpdGVtKVwiIFtpdGVtXT1cIml0ZW1cIiBbbmF2XT1cIm5hdlwiIFtyb2xlXT1cInBhbmVSb2xlXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJpdGVtLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmIHx8IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInskaW1wbGljaXQ6IGl0ZW0uYWN0aXZlIHx8IGlzUGFuZWxUcmFuc2l0aW9uaW5nKGl0ZW0pfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYk5hdk91dGxldCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIF9hY3RpdmVQYW5lOiBOZ2JOYXZQYW5lIHwgbnVsbCA9IG51bGw7XG5cbiAgQFZpZXdDaGlsZHJlbihOZ2JOYXZQYW5lKSBwcml2YXRlIF9wYW5lczogUXVlcnlMaXN0PE5nYk5hdlBhbmU+O1xuXG4gIC8qKlxuICAgKiBBIHJvbGUgdG8gc2V0IG9uIHRoZSBuYXYgcGFuZVxuICAgKi9cbiAgQElucHV0KCkgcGFuZVJvbGU7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSB0byB0aGUgYE5nYk5hdmBcbiAgICovXG4gIEBJbnB1dCgnbmdiTmF2T3V0bGV0JykgbmF2OiBOZ2JOYXY7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuXG4gIGlzUGFuZWxUcmFuc2l0aW9uaW5nKGl0ZW06IE5nYk5hdkl0ZW0pIHsgcmV0dXJuIHRoaXMuX2FjdGl2ZVBhbmUgPy5pdGVtID09PSBpdGVtOyB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIC8vIGluaXRpYWwgZGlzcGxheVxuICAgIHRoaXMuX2FjdGl2ZVBhbmUgPSB0aGlzLl9nZXRBY3RpdmVQYW5lKCk7XG4gICAgdGhpcy5fYWN0aXZlUGFuZSA/LmVsUmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xuICAgIHRoaXMuX2FjdGl2ZVBhbmUgPy5lbFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuXG4gICAgLy8gdGhpcyB3aWxsIGJlIGVtaXR0ZWQgZm9yIGFsbCAzIHR5cGVzIG9mIG5hdiBjaGFuZ2VzOiAuc2VsZWN0KCksIFthY3RpdmVJZF0gb3IgKGNsaWNrKVxuICAgIHRoaXMubmF2Lm5hdkl0ZW1DaGFuZ2UkXG4gICAgICAucGlwZShzdGFydFdpdGgodGhpcy5fYWN0aXZlUGFuZSA/Lml0ZW0gfHwgbnVsbCksIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHNraXAoMSkpXG4gICAgICAuc3Vic2NyaWJlKG5leHRJdGVtID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbnM6IE5nYlRyYW5zaXRpb25PcHRpb25zPHVuZGVmaW5lZD4gPSB7YW5pbWF0aW9uOiB0aGlzLm5hdi5hbmltYXRpb24sIHJ1bm5pbmdUcmFuc2l0aW9uOiAnc3RvcCd9O1xuXG4gICAgICAvLyBmYWRpbmcgb3V0XG4gICAgICBpZiAodGhpcy5fYWN0aXZlUGFuZSkge1xuICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX2FjdGl2ZVBhbmUuZWxSZWYubmF0aXZlRWxlbWVudCwgbmdiTmF2RmFkZU91dFRyYW5zaXRpb24sIG9wdGlvbnMpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYWN0aXZlSXRlbSA9IHRoaXMuX2FjdGl2ZVBhbmUgPy5pdGVtO1xuXG4gICAgICAgICAgLy8gbmV4dCBwYW5lbCB3ZSdyZSBzd2l0Y2hpbmcgdG8gd2lsbCBvbmx5IGFwcGVhciBpbiBET00gYWZ0ZXIgdGhlIGNoYW5nZSBkZXRlY3Rpb24gaXMgZG9uZVxuICAgICAgICAgIC8vIGFuZCBgdGhpcy5fcGFuZXNgIHdpbGwgYmUgdXBkYXRlZFxuICAgICAgICAgIHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgICAgIHRoaXMuX2FjdGl2ZVBhbmUgPSB0aGlzLl9nZXRQYW5lRm9ySXRlbShuZXh0SXRlbSk7XG5cbiAgICAgICAgICAvLyBmYWRpbmcgaW5cbiAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlUGFuZSkge1xuICAgICAgICAgICAgY29uc3QgZmFkZUluVHJhbnNpdGlvbiA9IHRoaXMubmF2LmFuaW1hdGlvbiA/IG5nYk5hdkZhZGVJblRyYW5zaXRpb24gOiBuZ2JOYXZGYWRlSW5Ob1JlZmxvd1RyYW5zaXRpb247XG4gICAgICAgICAgICBuZ2JSdW5UcmFuc2l0aW9uKHRoaXMuX2FjdGl2ZVBhbmUuZWxSZWYubmF0aXZlRWxlbWVudCwgZmFkZUluVHJhbnNpdGlvbiwgb3B0aW9ucykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYgKG5leHRJdGVtKSB7XG4gICAgICAgICAgICAgICAgbmV4dEl0ZW0uc2hvd24uZW1pdCgpO1xuICAgICAgICAgICAgICAgIHRoaXMubmF2LnNob3duLmVtaXQobmV4dEl0ZW0uaWQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgYWN0aXZlSXRlbS5oaWRkZW4uZW1pdCgpO1xuICAgICAgICAgICAgdGhpcy5uYXYuaGlkZGVuLmVtaXQoYWN0aXZlSXRlbS5pZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UGFuZUZvckl0ZW0oaXRlbTogTmdiTmF2SXRlbSB8IG51bGwpIHtcbiAgICByZXR1cm4gdGhpcy5fcGFuZXMgJiYgdGhpcy5fcGFuZXMuZmluZChwYW5lID0+IHBhbmUuaXRlbSA9PT0gaXRlbSkgfHwgbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEFjdGl2ZVBhbmUoKTogTmdiTmF2UGFuZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLl9wYW5lcyAmJiB0aGlzLl9wYW5lcy5maW5kKHBhbmUgPT4gcGFuZS5pdGVtLmFjdGl2ZSkgfHwgbnVsbDtcbiAgfVxufVxuIl19