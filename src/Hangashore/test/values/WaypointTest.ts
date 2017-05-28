import * as test from 'tape';
import {Waypoint} from '../../lib/values/Waypoint';

test(`Waypoint values can be encoded and decoded`, (t) => {
    t.plan(2);

    const w = new Waypoint(3, 1);
    const bytes = w.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Waypoint.decode(bytes), w);
});

test(`Waypoint values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const w = new Waypoint(3, 1);
    const bytes = w.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Waypoint.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), w);
});

test(`Waypoint values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    const bytes = '090000000000004540110000000000003840';
    const w = new Waypoint(42, 24);
    t.deepEqual(Waypoint.decode(Buffer.from(bytes, `hex`)), w);
});
