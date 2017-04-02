import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

export type StatusProps = {
    name: string,
    value: Observable<string>,
};

export type Sources = {
    props$: Observable<StatusProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (props: StatusProps): Observable<VNode> =>
    props.value.map(value => html`
        <div class="flex-col status-bar__status">
            <h4>${props.name}</h4>
            <div>${value}</div>
        </div>
    `);

export function Status(sources: Sources): Sinks {
    const vtree$ = sources.props$.flatMap(view);
    return {
        dom: vtree$,
    };
}
