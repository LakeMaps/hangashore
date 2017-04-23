const {Velocity: VelocityProtobuf} = require(`@lakemaps/schemas`);

export class Velocity {
    static decode(buf: Buffer): Velocity {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return Velocity.fromMessage(VelocityProtobuf.deserializeBinary(bytes));
    }

    static fromMessage(obj: any) {
        return new Velocity(obj.getSpeed(), obj.getTrueBearing());
    }

    private message: any;

    constructor(readonly speed: number, readonly trueBearing: number) {
        this.message = new VelocityProtobuf();
        this.message.setSpeed(speed);
        this.message.setTrueBearing(trueBearing);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
