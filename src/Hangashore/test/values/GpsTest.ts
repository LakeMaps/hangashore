import * as test from 'tape';
import {Gps} from '../../lib/values/Gps';
import {Position} from '../../lib/values/Position';
import {Velocity} from '../../lib/values/Velocity';

test(`Gps values can be encoded and decoded`, (t) => {
    t.plan(2);

    const g = new Gps(42, new Position(43, 44, 45), new Velocity(46, 47));
    const bytes = g.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Gps.decode(bytes), g);
});

test(`Gps values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const g = new Gps(42, new Position(43, 44, 45), new Velocity(46, 47));
    const bytes = g.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(Gps.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), g);
});

test(`Gps values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    // tslint:disable-next-line
    const bytes = '080152360d00000040121b09000000000000104011000000000000084019000000000000f03f1a12090000000000001440110000000000001840';
    const g = new Gps(2, new Position(4, 3, 1), new Velocity(5, 6));
    t.deepEqual(Gps.decode(Buffer.from(bytes, `hex`)), g);
});
