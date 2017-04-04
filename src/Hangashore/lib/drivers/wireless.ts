import {Observable, Subject} from 'rxjs';
import {Stream} from 'xstream';

import {WirelessLinkMicrocontroller} from '../microcontrollers';
import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
};

const makeWirelessDriver = (name: string) => {
    const m = WirelessLinkMicrocontroller.fromSerialPort(name);
    return (data$: Stream<Motion>): WirelessSource => {
        const motion$ = (<Observable<Motion>> Observable.from(data$));
        const rssi$ = new Subject<number>();

        motion$
            .mergeMap((data) => Motion.schema.encode(data))
            .exhaustMap((motion: Buffer) => Observable.defer(() => m.send(motion).then(_ => m.recv())))
            .subscribe((recv) => {
                rssi$.next(recv.rssi());
            });
        return {
            rssi$,
        };
    };
};

export {makeWirelessDriver};
