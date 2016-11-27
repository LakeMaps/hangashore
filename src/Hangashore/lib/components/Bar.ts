import {VNode} from '@cycle/dom';
import {Observable} from 'rx';
import {html} from 'hypercycle';

export type Sources = {
    props: {
        name: string,
        vtree$: Observable<VNode>[],
    }
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (...trees: VNode[]): VNode => html`
    <div class="flex-row status-bar__statuses">
        ${trees}
    </div>
`;

export function Bar(sources: Sources): Sinks {
    const vtree$ = Observable.combineLatest(sources.props.vtree$, (...trees: VNode[]) => html`
        <div class="flex-col status-bar">
            <h3>${sources.props.name}</h3>
            ${view(trees)}
        </div>
    `);
    return {
        dom: vtree$
    }
}
