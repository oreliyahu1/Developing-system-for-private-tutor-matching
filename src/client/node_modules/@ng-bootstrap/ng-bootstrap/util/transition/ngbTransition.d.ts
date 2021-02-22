import { Observable, Subject } from 'rxjs';
export declare type NgbTransitionStartFn<T = any> = (element: HTMLElement, context: T) => NgbTransitionEndFn | void;
export declare type NgbTransitionEndFn = () => void;
export interface NgbTransitionOptions<T> {
    animation: boolean;
    runningTransition: 'continue' | 'stop';
    context?: T;
}
export interface NgbTransitionCtx<T> {
    transition$: Subject<any>;
    context: T;
}
export declare const ngbRunTransition: <T>(element: HTMLElement, startFn: NgbTransitionStartFn<T>, options: NgbTransitionOptions<T>) => Observable<undefined>;
