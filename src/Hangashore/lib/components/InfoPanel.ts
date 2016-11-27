import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rx';

export type InfoPanelProps = {
    title: string,
    entries: {key: string, value: string}[],
};

export type Sources = {
    props$: Observable<InfoPanelProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (props: InfoPanelProps): VNode => html`
    <div class="flex-col box box--rounded info">
        <h3>${props.title}</h3>
        <table class="flex-col info__table">
            ${props.entries.map(entry => html`
                <tr>
                    <td>${entry.key}</td>
                    <td>${entry.value}</td>
                </tr>
            `)}
        </table>
    </div>
`;

export function InfoPanel(sources: Sources): Sinks {
    const vtree$ = sources.props$.map(view);
    return {
        dom: vtree$,
    };
}
