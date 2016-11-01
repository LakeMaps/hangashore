import {VNode, div} from '@cycle/dom';
import {Observable} from 'rx';

import {Constants} from '../constants';

export type Sinks = {
    DOM: Observable<VNode>
};

export function App(): Sinks {
    const vtree$ = Observable.of(div(Array.of(
        div(Constants.NAME),
    )));
    return {
        DOM: vtree$
    };
}
