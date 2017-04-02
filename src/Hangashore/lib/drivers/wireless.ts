import {Observable, Subject} from 'rxjs';
import {WirelessLinkMicrocontroller} from '../microcontrollers';

import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
};

const makeWirelessDriver = (name: string) => {
    const m = WirelessLinkMicrocontroller.fromSerialPort(name);
    return (data$: Observable<Motion>): WirelessSource => {
        const motion$ = data$.flatMap(data => Motion.schema.encode(data));
        const rssi$ = new Subject<number>();

        motion$
            .concatMap((motion) => Observable.defer(() => m.send(motion).then(_ => m.recv())))
            .subscribe((recv) => {
                rssi$.next(recv.rssi());
            });
        return {
            rssi$,
        };
    };
};

export {makeWirelessDriver};
