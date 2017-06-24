import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';

import {BOAT_HOST, BOAT_PORT} from '../constants';
import {App} from './App';
import {makeUdpDriver} from './drivers/broadcast';
import {AxialDeadzone, makeGamepadDriver} from './drivers/gamepad';
import {makeLogDriver} from './drivers/log';

run(App, {
    dom: makeDOMDriver(`#app`),
    gamepad: makeGamepadDriver({deadzone: AxialDeadzone(0.1)}),
    log: makeLogDriver({
        description: `Incoming RSSI values`,
        name: `RSSI logs`,
    }),
    wireless: makeUdpDriver(BOAT_HOST, BOAT_PORT),
});
