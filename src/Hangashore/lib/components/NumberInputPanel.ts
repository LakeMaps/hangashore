import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

export type NumberInputPanelSources = {
    dom: DOMSource,
    props: {
        key: string,
        defaultValue: number,
    },
};

export type NumberInputPanelSinks = {
    dom: Observable<VNode>,
    value$: Observable<number>,
};

const view = ({key, defaultValue}: any): VNode => html`
    <div class="flex-col box box--rounded number-input">
        <h5>${key}</h5>
        <input type="number" value="${defaultValue}">
    </div>
`;

export function NumberInputPanel({dom, props}: NumberInputPanelSources): NumberInputPanelSinks {
    const value$ = dom.select('input')
        .events('change')
        .map((e) => Number((<HTMLInputElement> e.target).value))
        .startWith(props.defaultValue);
    return {
        dom: Observable.of(view(props)),
        value$,
    };
}
