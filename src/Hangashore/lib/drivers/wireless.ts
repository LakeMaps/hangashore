import {Observable, Subject} from 'rx';
import {WirelessLinkMicrocontroller} from '../microcontrollers';

import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
};

const makeWirelessDriver = (name: string) => {
    const m = WirelessLinkMicrocontroller.fromSerialPort(name);
    return (data$: Observable<Motion>) => {
        const motion$ = data$.flatMap(data =>
            Observable.fromPromise(Motion.schema.encode(data)));
        const rssi$ = new Subject<number>();

        motion$.subscribe(motion => {
            m.send(motion);
            m.recv().then(response => rssi$.onNext(response.rssi()));
        });
        return {
            rssi$,
        };
    };
};

export {makeWirelessDriver};
