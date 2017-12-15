import {Motion as MotionProtobuf, TypedMessage} from '@lakemaps/schemas';

export class Motion {
    static decode(buf: Buffer): Motion {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = TypedMessage.deserializeBinary(bytes).getMotion();
        return Motion.fromMessage(obj);
    }

    static fromMessage(obj: any): Motion {
        return new Motion(obj.getSurge(), obj.getYaw());
    }

    private message: any;

    constructor(readonly surge: number, readonly yaw: number) {
        const motion = new MotionProtobuf();
        motion.setSurge(surge);
        motion.setYaw(yaw);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.MOTION);
        this.message.setMotion(motion);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
