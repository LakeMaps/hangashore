import * as test from 'tape';
import {Velocity} from '../../lib/values/Velocity';

test(`Velocity values can be encoded and decoded`, (t) => {
    t.plan(2);

    const v = new Velocity(42, 99);
    const bytes = v.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Velocity.decode(bytes), v);
});

test(`Velocity values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const v = new Velocity(55, 2);
    const bytes = v.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Velocity.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), v);
});

test(`Velocity values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    const bytes = '090000000000001440110000000000001840';
    const v = new Velocity(5, 6);
    t.deepEqual(Velocity.decode(Buffer.from(bytes, `hex`)), v);
});
