import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rx';

export type StatusProps = {
    name: string,
    value: string,
};

export type Sources = {
    props$: Observable<StatusProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (props: StatusProps): VNode => html`
    <div class="flex-col status-bar__status">
        <h4>${props.name}</h4>
        <div>${props.value}</div>
    </div>
`;

export function Status(sources: Sources): Sinks {
    const vtree$ = sources.props$.map(view);
    return {
        dom: vtree$,
    }
}
