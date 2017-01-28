import {Observable, Subject} from 'rx';
import {WirelessLinkMicrocontroller} from '../microcontrollers';

import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
};

const protobuf = require(`protocol-buffers`);
const messages = protobuf(`
    ${Motion.SCHEMA}
`);

const makeWirelessDriver = (name: string) => {
    const m = WirelessLinkMicrocontroller.fromSerialPort(name);
    return (data$: Observable<Motion>) => {
        const motion$ = data$.map(data => messages.Motion.encode({
            surge: data.surge,
            yaw: data.yaw,
        }));
        const rssi$ = new Subject<number>();

        motion$.subscribe(motion => {
            m.send(Buffer.from(motion));
            m.recv().then(response => rssi$.onNext(response.rssi()));
        });
        return {
            rssi$,
        };
    };
};

export {makeWirelessDriver};
