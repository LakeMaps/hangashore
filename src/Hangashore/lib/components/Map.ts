import {VNode} from '@cycle/dom';
import {html} from 'hypercycle';
import {Observable} from 'rx';

export type MapProps = {
    title: string,
    center: number[],
    zoom: number,
};

export type Sources = {
    props$: Observable<MapProps>,
};

export type Sinks = {
    dom: Observable<VNode>,
};

const view = (props: MapProps) => html`
    <div class="flex-col map-container">
        <div class="flex-col map-container__header">
            <h2>${props.title}</h2>
        </div>
        <div id="map" class="map"></div>
        <script>
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(L.map('map', {
            center: [${props.center[0]}, ${props.center[1]}],
            zoom: ${props.zoom}
        }));
        </script>
    </div>
`;

export function Map(sources: Sources): Sinks {
    const vtree$ = sources.props$.map(view);
    return {
        dom: vtree$,
    };
}
