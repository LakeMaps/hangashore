import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rx-run';

import {App} from './App';
import {makeGamepadDriver} from './drivers/gamepad';
import {makeWirelessDriver} from './drivers/wireless';

run(App, {
    dom: makeDOMDriver(`#app`),
    gamepad: makeGamepadDriver(),
    wireless: makeWirelessDriver(`/dev/cu.usbmodemFA131`),
});
