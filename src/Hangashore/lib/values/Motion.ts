import {Schema} from './Schema';

export class Motion {
    static readonly schema = Schema.of<Motion>(`Motion`);

    constructor(readonly surge: number, readonly yaw: number) { /* empty */ }
}
