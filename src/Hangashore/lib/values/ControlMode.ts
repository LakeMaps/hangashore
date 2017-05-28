const {ControlMode: ControlModeProtobuf, TypedMessage} = require(`@lakemaps/schemas`);

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
        const controlMode = new ControlModeProtobuf();
        controlMode.setMode(ControlModeProtobuf.Mode[this.name]);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.CONTROL_MODE);
        this.message.setControlMode(controlMode);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }

    toString() {
        return this.name;
    }
}
