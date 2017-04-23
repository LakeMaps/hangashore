import {Observable, Subject} from 'rxjs';
import {Stream} from 'xstream';

import {WirelessLinkMicrocontroller} from '../microcontrollers';
import {WirelessLinkReceiveMessage} from '../microcontrollers/WirelessLinkMicrocontroller';
import {Gps} from '../values/Gps';
import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
    gps$: Observable<Gps>,
};

const makeWirelessDriver = (name: string) => {
    const m = WirelessLinkMicrocontroller.fromSerialPort(name);
    return (data$: Stream<Motion>): WirelessSource => {
        const motion$ = (<Observable<Motion>> Observable.from(data$));
        const rssi$ = new Subject<number>();
        const gps$ = new Subject<Gps>();

        motion$
            .map((data) => data.encode())
            .exhaustMap((motion: Buffer) => Observable.defer(() => m.send(motion).then(_ => m.recv())))
            .filter((recv) => recv.containsMessage())
            .subscribe((recv: WirelessLinkReceiveMessage) => {
                rssi$.next(recv.rssi());
                gps$.next(Gps.decode(recv.body()));
            });
        return {
            rssi$,
            gps$,
        };
    };
};

export {makeWirelessDriver};
