import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

export type RadioSetOption = {
    checked?: boolean,
    enabled?: boolean,
    name: string,
    value: string,
};

export type RadioSetProps = {
    name: string,
    options: RadioSetOption[],
};

export type RadioSetSources = {
    dom: DOMSource,
    props$: Observable<RadioSetProps>,
};

export type RadioSetSinks = {
    dom: Observable<VNode>,
    selected$: Observable<string>,
};

const view = (props: RadioSetProps): VNode => {
    const buttons = props.options.map(({name, value, enabled, checked}) => html`
        <label class="button-panel__button">
            <input type="radio" ${enabled || `disabled`} name="rs" value="${value}" ${checked && `checked`} />
            ${name}
        </label>
    `);
    return html`
        <nav class="flex-col box box--rounded button-panel">
            <h3>${props.name}</h3>
            <div class="flex-row button-panel__buttons">${buttons}</div>
        </nav>
    `;
};

export function RadioSet({dom, props$}: RadioSetSources): RadioSetSinks {
    const initialSelected$ = props$.first()
        .flatMap(({options}) => {
            const selected = options.find(({enabled, checked}) => Boolean(enabled && checked));
            return selected
                ? Observable.of(selected.value)
                : Observable.empty();
        });
    const selected$ = dom.select('input')
        .events('change')
        .map((e) => (<HTMLInputElement> e.target).value);
    return {
        dom: props$.map(view),
        selected$: initialSelected$.concat(selected$),
    };
}
