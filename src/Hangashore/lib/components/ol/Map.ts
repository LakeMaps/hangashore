import {div, VNode} from '@cycle/dom';
import {DOMSource} from '@cycle/dom/rxjs-typings';
import {html} from 'hypercycle';
import {
    Collection,
    control,
    Coordinate,
    Feature,
    geom,
    interaction,
    layer as OLLayer,
    Map as OLMap,
    proj,
    source as OLSource,
    style,
    View,
} from 'openlayers';
import {Observable} from 'rxjs';

const {ScaleLine} = control;
const {Style, Fill, Stroke, Circle} = style;
const {Draw: DrawInteraction} = interaction;
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
    waypoint$: Observable<number[]>,
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
        controls: control.defaults().extend([new ScaleLine()]),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
            new VectorLayer({
                source: new Vector({features: [marker]}),
                style: new Style({
                    image: new Circle({
                        fill: new Fill({
                            color: 'rgba(255,255,255,0.4)',
                        }),
                        radius: 7,
                        stroke: new Stroke({
                            color: '#3399CC',
                            width: 2,
                        }),
                    }),
                }),
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

    const style = new Style({
        image: new Circle({
            fill: new Fill({
                color: `rgba(255, 255, 255, 0.5)`,
            }),
            radius: 7,
            stroke: new Stroke({
                color: `#00ff00`,
                width: 2,
            }),
        }),
    });
    const features: Collection<Feature> = new Collection<Feature>();
    const featureOverlay = new VectorLayer({
        source: new Vector({features}),
        style,
    });
    const drawInteraction = new DrawInteraction({features, type: 'Point', style});
    featureOverlay.setMap(map);
    map.addInteraction(drawInteraction);

    const waypoint$ = Observable.fromEvent(<any> features, 'add')
        .shareReplay(1)
        .map(() => features.item(features.getLength() - 1))
        .map((feature) => proj.toLonLat((<geom.Point> feature.getGeometry()).getCoordinates()));

    waypoint$
        .filter(() => features.getLength() > 1)
        .subscribe(() => features.removeAt(0));

    pos$.subscribe(pos => {
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
        waypoint$,
    };
}
