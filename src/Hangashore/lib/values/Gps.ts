import {Position} from './Position';
import {Velocity} from './Velocity';

const {Gps: GpsProtobuf} = require(`@lakemaps/schemas`);

export class Gps {
    static MESSAGE_SIZE = 54;

    static decode(buf: Buffer): Gps {
        if (buf.length > Gps.MESSAGE_SIZE) {
            return Gps.decode(buf.slice(0, Gps.MESSAGE_SIZE));
        }

        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = GpsProtobuf.deserializeBinary(bytes);
        return new Gps(
            obj.getHorizontalDilutionOfPrecision(),
            Position.fromMessage(obj.getPosition()),
            Velocity.fromMessage(obj.getVelocity()),
        );
    }

    private message: any;

    constructor(
        readonly horizontalDilutionOfPrecision: number,
        readonly position: Position,
        readonly velocity: Velocity,
    ) {
        this.message = new GpsProtobuf();
        this.message.setHorizontalDilutionOfPrecision(horizontalDilutionOfPrecision);
        this.message.setPosition((<any> position).message);
        this.message.setVelocity((<any> velocity).message);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
