import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';

import {BOAT_HOST, BOAT_PORT} from '../../constants';
import {Settings} from '../components/Settings';
import {makeUdpDriver} from '../drivers/broadcast';

run(Settings, {
    dom: makeDOMDriver(`#app`),
    wireless$: makeUdpDriver(BOAT_HOST, BOAT_PORT),
});
