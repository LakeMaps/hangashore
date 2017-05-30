import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import isolate from '@cycle/isolate';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

import {APPLICATION_NAME} from '../../constants';
import {Header} from './Header';
import {NumberInputPanel} from './NumberInputPanel';

export type Sources = {
    dom: DOMSource,
};

export type Sinks = {
    dom: Observable<VNode>,
    wireless$: Observable<Buffer>,
};

export function Settings({dom}: Sources): Sinks {
    const headerProps$ = Observable.of(`${APPLICATION_NAME} Settings`);
    const header = Header({props$: headerProps$});
    const skp = isolate(NumberInputPanel)({dom, props: {key: `Surge Proportional Gain`, defaultValue: 1}});
    const ski = isolate(NumberInputPanel)({dom, props: {key: `Surge Integral Gain`, defaultValue: 1}});
    const skd = isolate(NumberInputPanel)({dom, props: {key: `Surge Derivative Gain`, defaultValue: 1}});
    const ykp = isolate(NumberInputPanel)({dom, props: {key: `Yaw Proportional Gain`, defaultValue: 1}});
    const yki = isolate(NumberInputPanel)({dom, props: {key: `Yaw Integral Gain`, defaultValue: 1}});
    const ykd = isolate(NumberInputPanel)({dom, props: {key: `Yaw Derivative Gain`, defaultValue: 1}});
    const sControllerTimeStepProps = {key: `Surge Controller Time Step (ms)`, defaultValue: 100};
    const sControllerTimeStep = isolate(NumberInputPanel)({dom, props: sControllerTimeStepProps});
    const yControllerTimeStepProps = {key: `Yaw Controller Time Step (ms)`, defaultValue: 100};
    const yControllerTimeStep = isolate(NumberInputPanel)({dom, props: yControllerTimeStepProps});
    const vtree$ = Observable.combineLatest(
        header.dom,
        skp.dom,
        ski.dom,
        skd.dom,
        sControllerTimeStep.dom,
        ykp.dom,
        yki.dom,
        ykd.dom,
        yControllerTimeStep.dom,
        (headerNode: VNode, ...nodes: VNode[]): VNode => html`<div class="flex-col flex-1">${headerNode}${nodes}</div>`,
    );

    return {
        dom: vtree$,
        wireless$: Observable.empty(),
    };
}
