import { Injectable } from '@angular/core';
import { NgbConfig } from '../ngb-config';
import * as i0 from "@angular/core";
import * as i1 from "../ngb-config";
/**
 * A configuration service for the [`NgbPopover`](#/components/popover/api#NgbPopover) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
export class NgbPopoverConfig {
    constructor(ngbConfig) {
        this.autoClose = true;
        this.placement = 'auto';
        this.triggers = 'click';
        this.disablePopover = false;
        this.openDelay = 0;
        this.closeDelay = 0;
        this.animation = ngbConfig.animation;
    }
}
NgbPopoverConfig.ɵprov = i0.ɵɵdefineInjectable({ factory: function NgbPopoverConfig_Factory() { return new NgbPopoverConfig(i0.ɵɵinject(i1.NgbConfig)); }, token: NgbPopoverConfig, providedIn: "root" });
NgbPopoverConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
NgbPopoverConfig.ctorParameters = () => [
    { type: NgbConfig }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci1jb25maWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvcG9wb3Zlci9wb3BvdmVyLWNvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBRXpDLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7OztBQUV4Qzs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTyxnQkFBZ0I7SUFXM0IsWUFBWSxTQUFvQjtRQVRoQyxjQUFTLEdBQW1DLElBQUksQ0FBQztRQUNqRCxjQUFTLEdBQW1CLE1BQU0sQ0FBQztRQUNuQyxhQUFRLEdBQUcsT0FBTyxDQUFDO1FBRW5CLG1CQUFjLEdBQUcsS0FBSyxDQUFDO1FBRXZCLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRXFCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztJQUFDLENBQUM7Ozs7WUFaNUUsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7O1lBUnhCLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge05nYkNvbmZpZ30gZnJvbSAnLi4vbmdiLWNvbmZpZyc7XG5cbi8qKlxuICogQSBjb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBbYE5nYlBvcG92ZXJgXSgjL2NvbXBvbmVudHMvcG9wb3Zlci9hcGkjTmdiUG9wb3ZlcikgY29tcG9uZW50LlxuICpcbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBwb3BvdmVycyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlckNvbmZpZyB7XG4gIGFuaW1hdGlvbjogYm9vbGVhbjtcbiAgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ2luc2lkZScgfCAnb3V0c2lkZScgPSB0cnVlO1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudEFycmF5ID0gJ2F1dG8nO1xuICB0cmlnZ2VycyA9ICdjbGljayc7XG4gIGNvbnRhaW5lcjogc3RyaW5nO1xuICBkaXNhYmxlUG9wb3ZlciA9IGZhbHNlO1xuICBwb3BvdmVyQ2xhc3M6IHN0cmluZztcbiAgb3BlbkRlbGF5ID0gMDtcbiAgY2xvc2VEZWxheSA9IDA7XG5cbiAgY29uc3RydWN0b3IobmdiQ29uZmlnOiBOZ2JDb25maWcpIHsgdGhpcy5hbmltYXRpb24gPSBuZ2JDb25maWcuYW5pbWF0aW9uOyB9XG59XG4iXX0=