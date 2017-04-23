import * as test from 'tape';
import {Position} from '../../lib/values/Position';

test(`Position values can be encoded and decoded`, (t) => {
    t.plan(2);

    const p = new Position(4, 3, 1);
    const bytes = p.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Position.decode(bytes), p);
});

test(`Position values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const p = new Position(4, 3, 1);
    const bytes = p.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Position.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), p);
});

test(`Position values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    const bytes = '09000000000000104011000000000000084019000000000000f03f';
    const p = new Position(4, 3, 1);
    t.deepEqual(Position.decode(Buffer.from(bytes, `hex`)), p);
});
