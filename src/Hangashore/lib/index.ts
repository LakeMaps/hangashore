import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';

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
    wireless: makeUdpDriver('192.168.1.100', 12345),
});
