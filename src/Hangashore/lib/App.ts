import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rx-typings';
import {html} from 'hypercycle';
import {Observable} from 'rx';

import {Constants} from '../constants';
import {Bar} from './components/Bar';
import {ButtonPanel} from './components/ButtonPanel';
import {Header} from './components/Header';
import {InfoPanel} from './components/InfoPanel';
import {Map} from './components/Map';
import {Status} from './components/Status';
import {Motion} from './values/Motion';

export type Sources = {
    dom: DOMSource,
    gamepad: Observable<Gamepad>,
};

export type Sinks = {
    dom: Observable<VNode>,
    wireless: Observable<Motion>,
};

const view = (size: {x: number, y: number}) =>
    (header: VNode, panel: VNode, info1: VNode, info2: VNode, map: VNode, statusBar: VNode) => html`
        <div class="flex-col flex-1">
            ${header}
            <div class="flex-row flex-1">
                <div class="flex-col flex-1">
                    ${panel}
                    ${info1}
                    ${info2}
                </div>
                <div class="flex-col ${size.x < 1110 ? `flex-2` : `flex-3`}">
                    ${map}
                </div>
            </div>
            ${statusBar}
        </div>
    `;

export function App({gamepad}: Sources): Sinks {
    const size$ = Observable.fromEvent(<any> window, `resize`)
        .map(event => <Window> (<any> event).target)
        .startWith(window)
        .map(w => ({
            x: w.innerWidth,
            y: w.innerHeight,
        }));
    const header = Header({
        props$: Observable.just(Constants.NAME),
    });
    const statuses = [{
        name: `Battery`,
        value: Observable.just(`12.3 V`),
    }, {
        name: `Power Use`,
        value: Observable.just(`46 W`),
    }, {
        name: `Throttle`,
        value: Observable.just(`90%`),
    }, {
        name: `Steering`,
        value: Observable.just(`+5°`),
    }, {
        name: `Air Temp`,
        value: Observable.just(`21 °C`),
    }, {
        name: `Water Temp`,
        value: Observable.just(`16 °C`),
    }, {
        name: `Connection`,
        value: Observable.just(`Established`),
    }];
    const statusBar = Bar({
        props: {
            name: `System Information`,
            vtree$: statuses.map(status => Status({ props$: Observable.just(status) }).dom),
        },
    });
    const buttonPanel = ButtonPanel({
        props$: Observable.just({
            buttons: [
                `Auto`,
                `Manual`,
                `Return`,
                `Load`,
                `Standby`,
                `Bypass`,
            ],
            name: `Control Modes`,
        }),
    });
    const locationInfo = InfoPanel({
        props$: Observable.just({
            entries: [{
                key: `Latitude`,
                value: Observable.just(`49.201325°`),
            }, {
                key: `Longitude`,
                value: Observable.just(`-57.053745°`),
            }, {
                key: `Speed`,
                value: Observable.just(`2.7 m/s`),
            }, {
                key: `Heading`,
                value: Observable.just(`56°`),
            }, {
                key: `Elevation`,
                value: Observable.just(`87 m`),
            }, {
                key: `HDOP`,
                value: Observable.just(`6`),
            }],
            title: `Location Information`,
        }),
    });
    const missionInfo = InfoPanel({
        props$: Observable.just({
            entries: [{
                key: `Current Depth`,
                value: Observable.just(`4.09 m`),
            }, {
                key: `Distance Covered`,
                value: Observable.just(`1670 m`),
            }, {
                key: `Distance Left`,
                value: Observable.just(`1370 m`),
            }, {
                key: `Elapsed Time`,
                value: Observable.just(`00:34:15`),
            }, {
                key: `ETA Completion`,
                value: Observable.just(`00:27:56`),
            }, {
                key: `File Size`,
                value: Observable.just(`13567K`),
            }],
            title: `Mission Information`,
        }),
    });
    const map = Map({
        props$: Observable.just({
            center: [47.5652878, -52.6988835],
            title: `Real-time Tracking`,
            zoom: 16,
        }),
    });
    const components = [header, buttonPanel, locationInfo, missionInfo, map, statusBar];
    const vtree$ = size$.flatMap(size =>
        Observable.combineLatest(components.map(component => component.dom), view(size)));
    // TODO: buttons 6 and 7 need to be combined in a smarter way to handle simultaneous presses
    const motion$ = gamepad.filter(x => x !== undefined).map(g =>
        new Motion(g.buttons[7].value - g.buttons[6].value, -g.axes[0]));
    return {
        dom: vtree$,
        wireless: motion$,
    };
}
