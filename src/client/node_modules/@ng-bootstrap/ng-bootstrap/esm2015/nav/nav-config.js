import { Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * A configuration service for the [`NgbNav`](#/components/nav/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 *
 * @since 5.2.0
 */
export class NgbNavConfig {
    constructor(ngbConfig) {
        this.destroyOnHide = true;
        this.orientation = 'horizontal';
        this.roles = 'tablist';
        this.keyboard = false;
        this.animation = ngbConfig.animation;
    }
}
NgbNavConfig.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgbNavConfig_Factory() { return new NgbNavConfig(i0.ɵɵinject(i1.NgbConfig)); }, token: NgbNavConfig, providedIn: "root" });
NgbNavConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
NgbNavConfig.ctorParameters = () => [
    { type: NgbConfig }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2LWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9uYXYvbmF2LWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7OztBQUV4Qzs7Ozs7OztHQU9HO0FBRUgsTUFBTSxPQUFPLFlBQVk7SUFPdkIsWUFBWSxTQUFvQjtRQUxoQyxrQkFBYSxHQUFHLElBQUksQ0FBQztRQUNyQixnQkFBVyxHQUE4QixZQUFZLENBQUM7UUFDdEQsVUFBSyxHQUFzQixTQUFTLENBQUM7UUFDckMsYUFBUSxHQUFpQyxLQUFLLENBQUM7UUFFWCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7SUFBQyxDQUFDOzs7O1lBUjVFLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7OztZQVZ4QixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiQ29uZmlnfSBmcm9tICcuLi9uZ2ItY29uZmlnJztcblxuLyoqXG4gKiBBIGNvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIFtgTmdiTmF2YF0oIy9jb21wb25lbnRzL25hdi9hcGkjTmdiTmF2KSBjb21wb25lbnQuXG4gKlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIG5hdnMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQHNpbmNlIDUuMi4wXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk5hdkNvbmZpZyB7XG4gIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgZGVzdHJveU9uSGlkZSA9IHRydWU7XG4gIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnID0gJ2hvcml6b250YWwnO1xuICByb2xlczogJ3RhYmxpc3QnIHwgZmFsc2UgPSAndGFibGlzdCc7XG4gIGtleWJvYXJkOiBib29sZWFuIHwgJ2NoYW5nZVdpdGhBcnJvd3MnID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IobmdiQ29uZmlnOiBOZ2JDb25maWcpIHsgdGhpcy5hbmltYXRpb24gPSBuZ2JDb25maWcuYW5pbWF0aW9uOyB9XG59XG4iXX0=