import {Observable} from 'rx';
import {Factory as factory, WirelessCommunicationsMicrocontroller} from 'microcontrollers-sdk';

import {Motion} from '../values/Motion';

const protobuf = require(`protocol-buffers`);
const messages = protobuf(`
    ${Motion.SCHEMA}
`);

const makeWirelessDriver = (name: string) => {
    const m = factory(WirelessCommunicationsMicrocontroller, name);
    return (data$: Observable<Motion>) => {
        const motion$ = data$.map(data => messages.Motion.encode({
            surge: data.surge,
            yaw: data.yaw,
        }));

        motion$.subscribe(motion => m.send(Buffer.from(motion)));
    };
};

export {makeWirelessDriver};
