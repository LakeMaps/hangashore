import {Observable} from 'rx';
import {WirelessLinkMicrocontroller} from '../microcontrollers';

import {Motion} from '../values/Motion';

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

        motion$.subscribe(motion => m.send(Buffer.from(motion)));
    };
};

export {makeWirelessDriver};
