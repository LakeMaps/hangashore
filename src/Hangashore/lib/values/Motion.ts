const {Motion: MotionProtobuf} = require(`@lakemaps/schemas`);

export class Motion {
    static decode(buf: Buffer): Motion {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = MotionProtobuf.deserializeBinary(bytes);
        return Motion.fromMessage(obj);
    }

    static fromMessage(obj: any): Motion {
        return new Motion(obj.getSurge(), obj.getYaw());
    }

    private message: any;

    constructor(readonly surge: number, readonly yaw: number) {
        this.message = new MotionProtobuf();
        this.message.setSurge(surge);
        this.message.setYaw(yaw);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
