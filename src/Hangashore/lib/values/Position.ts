const {Position: PositionProtobuf} = require(`@lakemaps/schemas`);

export class Position {
    static decode(buf: Buffer): Position {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return Position.fromMessage(PositionProtobuf.deserializeBinary(bytes));
    }

    static fromMessage(obj: any) {
        return new Position(obj.getElevation(), obj.getLongitude(), obj.getLatitude());
    }

    private message: any;

    constructor(readonly elevation: number, readonly longitude: number, readonly latitude: number) {
        this.message = new PositionProtobuf();
        this.message.setElevation(elevation);
        this.message.setLongitude(longitude);
        this.message.setLatitude(latitude);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
