import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rx-typings';
import {html} from 'hypercycle';
import {Observable} from 'rx';

import {Header} from './components/Header';
import {Bar} from './components/Bar';
import {Map} from './components/Map';
import {ButtonPanel} from './components/ButtonPanel';
import {InfoPanel} from './components/InfoPanel';
import {Status} from './components/Status';
import {Constants} from '../constants';
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
                <div class="flex-col ${size.x < 1110 ? "flex-2" : "flex-3"}">
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
        props$: Observable.just(Constants.NAME)
    });
    const statuses = [{
        name: `Battery`,
        value: `12.3 V`,
    }, {
        name: `Power Use`,
        value: `46 W`
    }, {
        name: `Throttle`,
        value: `90%`
    }, {
        name: `Steering`,
        value: `+5°`
    }, {
        name: `Air Temp`,
        value: `21 °C`
    }, {
        name: `Water Temp`,
        value: `16 °C`
    }, {
        name: `Connection`,
        value: `Established`
    }];
    const statusBar = Bar({
        props: {
            name: `System Information`,
            vtree$: statuses.map(status => Status({ props$: Observable.just(status) }).dom),
        }
    });
    const buttonPanel = ButtonPanel({
        props$: Observable.just({
            name: `Control Modes`,
            buttons: [
                `Auto`,
                `Manual`,
                `Return`,
                `Load`,
                `Standby`,
                `Bypass`,
            ]
        })
    });
    const locationInfo = InfoPanel({
        props$: Observable.just({
            title: `Location Information`,
            entries: [{
                key: `Latitude`,
                value: `49.201325°`
            }, {
                key: `Longitude`,
                value: `-57.053745°`
            }, {
                key: `Speed`,
                value: `2.7 m/s`
            }, {
                key: `Heading`,
                value: `56°`
            }, {
                key: `Elevation`,
                value: `87 m`
            }, {
                key: `HDOP`,
                value: `6`
            }]
        })
    });
    const missionInfo = InfoPanel({
        props$: Observable.just({
            title: `Mission Information`,
            entries: [{
                key: `Current Depth`,
                value: `4.09 m`
            }, {
                key: `Distance Covered`,
                value: `1670 m`
            }, {
                key: `Distance Left`,
                value: `1370 m`
            }, {
                key: `Elapsed Time`,
                value: `00:34:15`
            }, {
                key: `ETA Completion`,
                value: `00:27:56`
            }, {
                key: `File Size`,
                value: `13567K`
            }]
        })
    });
    const map = Map({
        props$: Observable.just({
            title: `Real-time Tracking`,
            center: [47.5652878, -52.6988835],
            zoom: 16,
        })
    });
    const components = [header, buttonPanel, locationInfo, missionInfo, map, statusBar];
    const vtree$ = size$.flatMap(size => Observable.combineLatest(components.map(component => component.dom), view(size)));
    // TODO: buttons 6 and 7 need to be combined in a smarter way to handle simultaneous presses
    const motion$ = gamepad.filter(x => x !== undefined).map(g => new Motion(g.buttons[7].value - g.buttons[6].value, g.axes[0]));
    return {
        dom: vtree$,
        wireless: motion$,
    };
}
