import {Position} from './Position';
import {Velocity} from './Velocity';

const {Gps: GpsProtobuf, TypedMessage} = require(`@lakemaps/schemas`);

export class Gps {
    static decode(buf: Buffer): Gps {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = TypedMessage.deserializeBinary(bytes).getGps();
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
        const gps = new GpsProtobuf();
        gps.setHorizontalDilutionOfPrecision(horizontalDilutionOfPrecision);
        gps.setPosition((<any> position).message);
        gps.setVelocity((<any> velocity).message);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.GPS);
        this.message.setGps(gps);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
