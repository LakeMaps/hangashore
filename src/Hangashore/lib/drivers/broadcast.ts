import {createSocket} from 'dgram';
import {Observable, Subject} from 'rxjs';
import {Stream} from 'xstream';

import {Gps} from '../values/Gps';
import {MissionInformation} from '../values/MissionInformation';
import {TypedMessage} from '../values/TypedMessage';

export type WirelessSource = {
    missionInformation$: Observable<MissionInformation>,
    rssi$: Observable<number>,
    gps$: Observable<Gps>,
};

const makeUdpDriver = (address: string, port: number) => {
    const socket = createSocket({type: 'udp4', reuseAddr: true});

    socket.bind({port});

    return (data$: Stream<Buffer>): WirelessSource => {
        const motion$ = (<Observable<Buffer>> Observable.from(data$));
        const rssi$ = new Subject<number>();
        const gps$ = new Subject<Gps>();
        const missionInformation$ = new Subject<MissionInformation>();

        Observable.fromEvent(socket, 'message')
            .subscribe((msg: Buffer) => {
                const typedMessage = TypedMessage.decode(msg);
                if (typedMessage.isGps()) {
                    gps$.next(Gps.decode(msg));
                    return;
                }
                if (typedMessage.isMissionInformation()) {
                    missionInformation$.next(MissionInformation.decode(msg));
                    return;
                }
            });

        motion$.subscribe((motion: Buffer) => {
            // TODO: Is there a way to read RSSI from the OS?
            socket.send(motion, port, address);
        });

        return {
            missionInformation$,
            rssi$,
            gps$,
        };
    };
};

export {makeUdpDriver};
