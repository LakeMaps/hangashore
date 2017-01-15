export class Motion {
    static readonly SCHEMA = `
        message Motion {
            required float surge = 1;
            required float yaw = 2;
        }
    `;

    constructor(readonly surge: number, readonly yaw: number) {
        // ???
    }
}
