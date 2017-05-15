import {createSocket} from 'dgram';
import {Observable, Subject} from 'rxjs';
import {Stream} from 'xstream';

import {Gps} from '../values/Gps';
import {Motion} from '../values/Motion';

export type WirelessSource = {
    rssi$: Observable<number>,
    gps$: Observable<Gps>,
};

const makeUdpDriver = (address: string, port: number) => {
    const socket = createSocket(`udp4`);

    socket.bind({port});

    return (data$: Stream<Motion>): WirelessSource => {
        const motion$ = (<Observable<Motion>> Observable.from(data$));
        const rssi$ = new Subject<number>();
        const gps$ = new Subject<Gps>();

        Observable.fromEvent(socket, 'message')
            .subscribe((msg: Buffer) => {
                gps$.next(Gps.decode(msg));
            });

        motion$
            .map((data) => data.encode())
            .subscribe((motion: Buffer) => {
                // TODO: Is there a way to read RSSI from the OS?
                socket.send(motion, port, address);
            });

        return {
            rssi$,
            gps$,
        };
    };
};

export {makeUdpDriver};
