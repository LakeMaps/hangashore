import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rx';

export type ButtonPanelProps = {
    name: string,
    buttons: string[],
};

export type Sources = {
    props$: Observable<ButtonPanelProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (props: ButtonPanelProps): VNode => html`
    <div class="flex-col box box--rounded button-panel">
        <h3>${props.name}</h3>
        <div class="flex-row button-panel__buttons">
            ${props.buttons.map(name => html`<button class="button-panel__button">${name}</button>`)}
        </div>
    </div>
`;

export function ButtonPanel(sources: Sources): Sinks {
    const vtree$ = sources.props$.map(view);
    return {
        dom: vtree$,
    };
}
