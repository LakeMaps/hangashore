import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rxjs-run';

import {Settings} from '../components/Settings';
import {makeUdpDriver} from '../drivers/broadcast';

run(Settings, {
    dom: makeDOMDriver(`#app`),
    wireless$: makeUdpDriver('192.168.1.100', 12346),
});
