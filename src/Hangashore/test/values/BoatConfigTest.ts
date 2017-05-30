import * as test from 'tape';
import {BoatConfig} from '../../lib/values/BoatConfig';
import {PidControllerGains} from '../../lib/values/PidControllerGains';

test(`BoatConfig values can be encoded and decoded`, (t) => {
    t.plan(2);

    const b = new BoatConfig(new PidControllerGains(4, 5, 6), 1, new PidControllerGains(7, 8, 9), 1);
    const bytes = b.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(BoatConfig.decode(bytes), b);
});

test(`BoatConfig values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const b = new BoatConfig(new PidControllerGains(4, 5, 6), 1, new PidControllerGains(7, 8, 9), 1);
    const bytes = b.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(BoatConfig.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), b);
});

test(`BoatConfig values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    // tslint:disable-next-line
    const bytes = '08067a4c0a1b09000000000000104011000000000000144019000000000000184011000000000000f03f1a1b090000000000001c4011000000000000204019000000000000224021000000000000f03f';
    const b = new BoatConfig(new PidControllerGains(4, 5, 6), 1, new PidControllerGains(7, 8, 9), 1);
    t.deepEqual(BoatConfig.decode(Buffer.from(bytes, `hex`)), b);
});
