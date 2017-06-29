import {VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {html} from 'hypercycle';
import {Coordinate as OLCoordinate, Map as OLMap, proj, View as OLView} from 'openlayers';
import {Observable} from 'rxjs';

type Props = {
    pos$: Observable<OLCoordinate>,
    view: OLView,
};

type Sources = {
    dom: DOMSource,
    map$: Observable<OLMap>,
    props$: Observable<Props>,
};

type Sinks = {
    dom: Observable<VNode>,
};

export function MapCenter({dom, props$}: Sources): Sinks {
    const pos$: Observable<OLCoordinate> = props$.flatMap((props) => props.pos$);

    dom
        .select('button')
        .events('click')
        .withLatestFrom(props$, pos$, (_, {view}, pos) => ({view, pos}))
        .subscribe(({pos, view}) => {
            view.setCenter(proj.fromLonLat(pos));
        })
    ;

    return {
        dom: Observable.of(html`<div class="map-control-center ol-unselectable ol-control"><button>◎</button></div>`),
    };
}
