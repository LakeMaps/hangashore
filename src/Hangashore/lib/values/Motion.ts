import {Schema} from './Schema';

export class Motion {
    static readonly schema = Schema.of<Motion>(`Motion`);

    static equals(a: Motion, b: Motion): boolean {
        return (a.surge === b.surge && a.yaw === b.yaw);
    }

    constructor(readonly surge: number, readonly yaw: number) { /* empty */ }
}
