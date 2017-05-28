import * as test from 'tape';
import {ControlMode} from '../../lib/values/ControlMode';

test(`ControlMode values can be encoded`, (t) => {
    t.plan(1);

    const m = ControlMode.WAYPOINT;
    const bytes = m.encode();
    t.ok(bytes instanceof Buffer);
});
