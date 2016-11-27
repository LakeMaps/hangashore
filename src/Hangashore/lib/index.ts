import {makeDOMDriver} from '@cycle/dom';
import {run} from '@cycle/rx-run';

import {App} from './App';

run(App, {
    dom: makeDOMDriver(`#app`),
});
