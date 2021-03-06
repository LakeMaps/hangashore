import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import isolate from '@cycle/isolate';
import {html} from 'hypercycle';
import {Observable} from 'rxjs';

import {APPLICATION_NAME} from '../constants';
import {Bar} from './components/Bar';
import {Header} from './components/Header';
import {InfoPanel} from './components/InfoPanel';
import {OpenLayersMap, OpenLayersMapSinks} from './components/ol/Map';
import {RadioSet, RadioSetSinks} from './components/RadioSet';
import {Status} from './components/Status';
import {WirelessSource} from './drivers/broadcast';
import {ControlMode} from './values/ControlMode';
import {Gps} from './values/Gps';
import {Motion} from './values/Motion';
import {Waypoint} from './values/Waypoint';

export type Sources = {
    dom: DOMSource,
    gamepad: Observable<Gamepad>,
    wireless: WirelessSource,
};

export type Sinks = {
    dom: Observable<VNode>,
    wireless: Observable<Buffer>,
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
        props$: Observable.of(APPLICATION_NAME),
    });
    const statuses = [{
        name: `Battery`,
        value: Observable.of(`---`),
    }, {
        name: `Power Use`,
        value: Observable.of(`---`),
    }, {
        name: `Throttle`,
        value: Observable.of(`---`),
    }, {
        name: `Steering`,
        value: Observable.of(`---`),
    }, {
        name: `Air Temp`,
        value: Observable.of(`---`),
    }, {
        name: `Water Temp`,
        value: Observable.of(`---`),
    }, {
        name: `RSSI`,
        value: wireless.rssi$.map(rssi => `${rssi.toFixed()} dBm`).startWith(`---`),
    }];
    const statusBar = Bar({
        props: {
            name: `System Information`,
            vtree$: statuses.map(status => Status({ props$: Observable.of(status) }).dom),
        },
    });
    const controlModes: RadioSetSinks = isolate(RadioSet)({
        props$: Observable.of({
            name: `Control Modes`,
            options: [{
                checked: true,
                enabled: true,
                name: `Manual`,
                value: ControlMode.MANUAL.toString(),
            }, {
                enabled: true,
                name: `Waypoint`,
                value: ControlMode.WAYPOINT.toString(),
            }, {
                name: `Return`,
            }, {
                name: `Load`,
            }, {
                name: `Standby`,
            }, {
                name: `Bypass`,
            }],
        }),
        dom,
    });
    const locationInfo = InfoPanel({
        props$: Observable.of({
            entries: [{
                key: `Latitude`,
                value: wireless.gps$.map((gps: Gps) => `${gps.position.latitude.toFixed(4)}°`).startWith(`---`),
            }, {
                key: `Longitude`,
                value: wireless.gps$.map((gps: Gps) => `${gps.position.longitude.toFixed(4)}°`).startWith(`---`),
            }, {
                key: `Speed`,
                value: wireless.gps$.map((gps: Gps) => `${gps.velocity.speed.toFixed(2)} m/s`).startWith(`---`),
            }, {
                key: `Heading`,
                value: wireless.gps$.map((gps: Gps) => `${gps.velocity.trueBearing.toFixed(2)}°`).startWith(`---`),
            }, {
                key: `Elevation`,
                value: wireless.gps$.map((gps: Gps) => `${gps.position.elevation.toFixed(2)} m`).startWith(`---`),
            }, {
                key: `HDOP`,
                value: wireless.gps$.map((gps: Gps) => `${gps.horizontalDilutionOfPrecision.toFixed(2)}`)
                    .startWith(`---`),
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
                key: `Distance to Waypoint`,
                value: wireless.missionInformation$.map((m) => `${m.distanceToWaypoint.toFixed(2)} m`).startWith(`---`),
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
    const components = [header, controlModes, locationInfo, missionInfo, map, statusBar];
    const vtree$ = size$.flatMap(size =>
        Observable.combineLatest(components.map(component => component.dom), view(size)));
    // TODO: buttons 6 and 7 need to be combined in a smarter way to handle simultaneous presses
    const motion$ = gamepad.filter((x) => x !== undefined)
        .map((g) => new Motion(g.buttons[7].value - g.buttons[6].value, -g.axes[0]))
        .map((m) => m.encode());
    const controlMode$ = controlModes.selected$
        .map((x) => ControlMode.from(x))
        .map((c) => c.encode());
    const waypoint$ = map.waypoint$
        .map((w) => new Waypoint(w[0], w[1]))
        .map((w) => w.encode());
    return {
        dom: vtree$,
        wireless: Observable.merge(motion$, controlMode$, waypoint$),
    };
}
