import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';

import {App} from './App';
import {makeGamepadDriver} from './drivers/gamepad';
import {makeLogDriver} from './drivers/log';
import {makeWirelessDriver} from './drivers/wireless';

run(App, {
    dom: makeDOMDriver(`#app`),
    gamepad: makeGamepadDriver(),
    log: makeLogDriver({
        description: `Incoming RSSI values`,
        name: `RSSI logs`,
    }),
    wireless: makeWirelessDriver(`/dev/cu.usbmodemFA131`),
});
