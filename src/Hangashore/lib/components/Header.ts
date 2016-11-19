import {VNode} from '@cycle/dom';
import {Observable} from 'rx';
import {html} from 'hypercycle';

export type Sources = {
    props$: Observable<string>
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (name: string): VNode => html`
    <div class="flex-row header">
        <h1>${name}</h1>
    </div>
`;

export function Header(sources: Sources): Sinks {
    const vtree$ = sources.props$.map(view);
    return {
        dom: vtree$
    }
}
