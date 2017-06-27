import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';
import {Map as OLMap} from 'openlayers';
import {control} from 'openlayers';
import {Observable, Subject} from 'rxjs';

const {Control} = control;

class CycleControl<So, Si> extends Control {
    private readonly map$: Subject<OLMap>;

    constructor(component: (sources: So) => Si, drivers: object) {
        const element = document.createElement('div');
        super({
            element,
        });

        this.map$ = new Subject();
        run(component, <any> {
            dom: makeDOMDriver(element),
            map$: () => this.map$,
            ...drivers,
        });
    }

    setMap(map: OLMap) {
        super.setMap(map);
        this.map$.next(map);
    }
}

export function newControl<T, R>(component: (sources: T) => R, props: object = {}) {
    return new CycleControl(component, {
        props$: () => Observable.of(props),
    });
}
