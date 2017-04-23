import {div, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {html} from 'hypercycle';
import {Coordinate, Feature, geom, layer as OLLayer, Map as OLMap, proj, source as OLSource, View} from 'openlayers';
import {Observable} from 'rxjs';

const {Tile: TileLayer, Vector: VectorLayer} = OLLayer;
const {OSM, Vector} = OLSource;
const {Point} = geom;

export type MapProps = {
    title: string,
};

export type OpenLayersMapSources = {
    dom: DOMSource,
    pos$: Observable<Coordinate>,
    props$: Observable<MapProps>,
};

export type OpenLayersMapSinks = {
    dom: Observable<VNode>,
};

export function OpenLayersMap({props$, pos$}: OpenLayersMapSources): OpenLayersMapSinks {
    const marker = new Feature({
        geometry: new Point(proj.fromLonLat([-52.6988835, 47.5652878])),
        type: 'icon',
    });
    const view = new View({
        center: proj.fromLonLat([-52.6988835, 47.5652878]),
        zoom: 16,
    });
    const map = new OLMap({
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: new Vector({features: [marker]}),
            }),
        ],
        view,
    });
    const mapVNode = div('.map', {
        hook: {
            insert: (node: VNode) => {
                map.setTarget(<Element> node.elm);
            },
        },
    });

    pos$.subscribe(pos => {
        // FIXME: I forgot to read the GPS values correctly
        pos[0] = -pos[0];
        marker.setGeometry(new Point(proj.fromLonLat(pos)));
        view.setCenter(proj.fromLonLat(pos));
    });

    return {
        dom: props$.map((props: MapProps) => html`
            <div class="flex-col map-container">
                <div class="flex-col map-container__header">
                    <h2>${props.title}</h2>
                </div>
                ${mapVNode}
            </div>
        `),
    };
}
