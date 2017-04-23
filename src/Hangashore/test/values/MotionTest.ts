import * as test from 'tape';
import {Motion} from '../../lib/values/Motion';

test(`Motion values can be encoded and decoded`, (t) => {
    t.plan(2);

    const m = new Motion(1, 2);
    const bytes = m.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Motion.decode(bytes), m);
});

test(`Motion values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const m = new Motion(1, 2);
    const bytes = m.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Motion.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), m);
});

test(`Motion values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    const bytes = '09000000000000f03f110000000000000040';
    const m = new Motion(1, 2);
    t.deepEqual(Motion.decode(Buffer.from(bytes, `hex`)), m);
});
