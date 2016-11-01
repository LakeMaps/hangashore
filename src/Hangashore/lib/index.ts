import {run} from '@cycle/rx-run';
import {makeDOMDriver} from '@cycle/dom';
import {App} from './App';

run(App, {
    DOM: makeDOMDriver(`#app`)
});
