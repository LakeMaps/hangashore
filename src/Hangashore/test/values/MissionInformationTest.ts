import * as test from 'tape';
import {MissionInformation} from '../../lib/values/MissionInformation';

test(`MissionInformation values can be encoded and decoded`, (t) => {
    t.plan(2);

    const m = new MissionInformation(42);
    const bytes = m.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(MissionInformation.decode(bytes), m);
});

test(`MissionInformation values can be decoded when they are zero-padded`, (t) => {
    t.plan(2);

    const m = new MissionInformation(42);
    const bytes = m.encode();
    t.ok(bytes instanceof Buffer);
    t.deepEqual(MissionInformation.decode(Buffer.concat([bytes, Buffer.alloc(128, 0x00)])), m);
});

test(`MissionInformation values can be decoded from a given set of bytes`, (t) => {
    t.plan(1);

    const bytes = '08057209090000000000004540';
    const m = new MissionInformation(42);
    t.deepEqual(MissionInformation.decode(Buffer.from(bytes, `hex`)), m);
});
