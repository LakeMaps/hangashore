import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import isolate from '@cycle/isolate';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

import {Constants} from '../constants';
import {Bar} from './components/Bar';
import {ButtonPanel} from './components/ButtonPanel';
import {Header} from './components/Header';
import {InfoPanel} from './components/InfoPanel';
import {OpenLayersMap, OpenLayersMapSinks} from './components/ol/Map';
import {Status} from './components/Status';
import {WirelessSource} from './drivers/wireless';
import {Motion} from './values/Motion';

export type Sources = {
    dom: DOMSource,
    gamepad: Observable<Gamepad>,
    wireless: WirelessSource,
};

export type Sinks = {
    dom: Observable<VNode>,
    log: Observable<any>,
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

export function App({dom, gamepad, wireless}: Sources): Sinks {
    const size$ = Observable.fromEvent(<any> window, `resize`)
        .map(event => <Window> (<any> event).target)
        .startWith(window)
        .map(w => ({
            x: w.innerWidth,
            y: w.innerHeight,
        }));
    const header = Header({
        props$: Observable.of(Constants.NAME),
    });
    const statuses = [{
        name: `Battery`,
        value: Observable.of(`12.3 V`),
    }, {
        name: `Power Use`,
        value: Observable.of(`46 W`),
    }, {
        name: `Throttle`,
        value: Observable.of(`90%`),
    }, {
        name: `Steering`,
        value: Observable.of(`+5°`),
    }, {
        name: `Air Temp`,
        value: Observable.of(`21 °C`),
    }, {
        name: `Water Temp`,
        value: Observable.of(`16 °C`),
    }, {
        name: `RSSI`,
        value: wireless.rssi$.map(rssi => `${rssi.toFixed()} dBm`).startWith(`???`),
    }];
    const statusBar = Bar({
        props: {
            name: `System Information`,
            vtree$: statuses.map(status => Status({ props$: Observable.of(status) }).dom),
        },
    });
    const buttonPanel = ButtonPanel({
        props$: Observable.of({
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
        props$: Observable.of({
            entries: [{
                key: `Latitude`,
                value: Observable.of(`49.201325°`),
            }, {
                key: `Longitude`,
                value: Observable.of(`-57.053745°`),
            }, {
                key: `Speed`,
                value: Observable.of(`2.7 m/s`),
            }, {
                key: `Heading`,
                value: Observable.of(`56°`),
            }, {
                key: `Elevation`,
                value: Observable.of(`87 m`),
            }, {
                key: `HDOP`,
                value: Observable.of(`6`),
            }],
            title: `Location Information`,
        }),
    });
    const missionInfo = InfoPanel({
        props$: Observable.of({
            entries: [{
                key: `Current Depth`,
                value: Observable.of(`---`),
            }, {
                key: `Distance Covered`,
                value: Observable.of(`---`),
            }, {
                key: `Distance Left`,
                value: Observable.of(`---`),
            }, {
                key: `Elapsed Time`,
                value: Observable.of(`---`),
            }, {
                key: `ETA Completion`,
                value: Observable.of(`---`),
            }, {
                key: `File Size`,
                value: Observable.of(`---`),
            }],
            title: `Mission Information`,
        }),
    });
    const map: OpenLayersMapSinks = isolate(OpenLayersMap)({
        dom,
        pos$: wireless.gps$.map(gps => [gps.position.longitude, gps.position.latitude]),
        props$: Observable.of({
            title: `Real-time Tracking`,
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
        log: wireless.rssi$,
        wireless: motion$,
    };
}
