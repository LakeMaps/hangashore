import {ControlMode as ControlModeProtobuf, TypedMessage} from '@lakemaps/schemas';

export class ControlMode {
    static readonly WAYPOINT = new ControlMode(ControlModeProtobuf.Mode.WAYPOINT);

    static readonly MANUAL = new ControlMode(ControlModeProtobuf.Mode.MANUAL);

    static from(name: string): ControlMode {
        if ((<any> ControlMode)[name]) {
            return (<any> ControlMode)[name];
        }

        throw new Error(`Invalid control mode`);
    }

    private message: any;

    private constructor(private readonly mode: ControlModeProtobuf.Mode) {
        const controlMode = new ControlModeProtobuf();
        controlMode.setMode(mode);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.CONTROL_MODE);
        this.message.setControlMode(controlMode);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }

    toString() {
        return Object.keys(ControlModeProtobuf.Mode)[this.mode];
    }
}
