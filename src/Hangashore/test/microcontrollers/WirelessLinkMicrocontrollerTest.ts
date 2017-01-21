import * as test from 'tape';
import {Message, WirelessLinkMicrocontroller} from "../../lib/microcontrollers";

test(`WirelessLinkMicrocontroller#send does send the correct bytes`, (t) => {
    t.plan(2);

    const expectedSend = Buffer.concat([
        Buffer.from([0xAA, 0x04]), Buffer.alloc(61).fill(0x42), Buffer.from([0xE2, 0x7F])
    ]);
    const expectedRecv = Buffer.concat([
        Buffer.from([0xAA, 0x04, 0x01, 0xA6, 0xB8])
    ]);

    let callCount = 0;
    let sent: Uint8Array;
    const recv = () => Promise.resolve(expectedRecv[callCount++]);
    const microcontroller = new WirelessLinkMicrocontroller(recv, (buffer: Uint8Array) => {
        sent = buffer;
        return Promise.resolve(true);
    });

    microcontroller.send(Buffer.alloc(61).fill(0x42))
        .then((message: Message) => {
            t.deepEqual(sent, expectedSend);
            t.deepEqual(message.buffer(), expectedRecv);
        })
        .catch(t.fail.bind(t));
});

test(`WirelessLinkMicrocontroller#recv does send the correct bytes`, (t) => {
    t.plan(2);

    const expectedSend = Buffer.concat([
        Buffer.from([0xAA, 0x03, 0x00, 0x2F, 0x0E])
    ]);
    const expectedRecv = Buffer.concat([
        Buffer.from([0xAA, 0x03, 0x01]), Buffer.alloc(61).fill(0x42), Buffer.from([0x43, 0x43, 0x5E, 0x18])
    ]);

    let callCount = 0;
    let sent: Uint8Array;
    const recv = () => Promise.resolve(expectedRecv[callCount++]);
    const microcontroller = new WirelessLinkMicrocontroller(recv, (buffer: Uint8Array) => {
        sent = buffer;
        return Promise.resolve(true);
    });

    microcontroller.recv()
        .then((message: Message) => {
            t.deepEqual(sent, expectedSend);
            t.deepEqual(message.buffer(), expectedRecv);
        })
        .catch(t.fail.bind(t));
});
