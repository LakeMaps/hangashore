import * as test from 'tape';
import {Message} from "../../lib/microcontrollers";

test(`Message#buffer returns correct bytes`, (t) => {
    t.plan(1);

    const message = new Message(0x10, Buffer.alloc(1));
    t.deepEqual(message.buffer(), Buffer.from([0xAA, 0x10, 0x00, 0x79, 0x2E]));
});
