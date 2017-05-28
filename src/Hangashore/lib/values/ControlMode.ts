const {ControlMode: ControlModeProtobuf} = require(`@lakemaps/schemas`);

export class ControlMode {
    static readonly WAYPOINT = new ControlMode(`WAYPOINT`);

    static readonly MANUAL = new ControlMode(`MANUAL`);

    static from(name: string): ControlMode {
        if ((<any> ControlMode)[name]) {
            return (<any> ControlMode)[name];
        }

        throw new Error(`Invalid control mode`);
    }

    private message: any;

    private constructor(private readonly name: string) {
        this.message = new ControlModeProtobuf();
        this.message.setMode(ControlModeProtobuf.Mode[this.name]);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }

    toString() {
        return this.name;
    }
}
