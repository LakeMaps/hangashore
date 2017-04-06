import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

export type InfoPanelPropsEntry = {
    key: string,
    value: Observable<string>,
};

export type InfoPanelProps = {
    title: string,
    entries: InfoPanelPropsEntry[],
};

export type Sources = {
    props$: Observable<InfoPanelProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const viewEntry = (entry: InfoPanelPropsEntry): Observable<VNode> =>
    entry.value.map(value => html`
        <tr>
            <td>${entry.key}</td>
            <td>${value}</td>
        </tr>
    `);

const view = (props: InfoPanelProps): Observable<VNode> =>
    Observable.combineLatest(
        props.entries.map(viewEntry),
        (...entryViews: VNode[]) => html`
            <div class="flex-col box box--rounded info">
                <h3>${props.title}</h3>
                <table class="flex-col info__table">
                    ${entryViews}
                </table>
            </div>
        `,
    );

export function InfoPanel(sources: Sources): Sinks {
    const vtree$ = sources.props$.flatMap(view);
    return {
        dom: vtree$,
    };
}
