const {Waypoint: WaypointProtobuf} = require(`@lakemaps/schemas`);

export class Waypoint {
    static decode(buf: Buffer): Waypoint {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return Waypoint.fromMessage(WaypointProtobuf.deserializeBinary(bytes));
    }

    static fromMessage(obj: any) {
        return new Waypoint(obj.getLongitude(), obj.getLatitude());
    }

    private message: any;

    constructor(readonly longitude: number, readonly latitude: number) {
        this.message = new WaypointProtobuf();
        this.message.setLongitude(longitude);
        this.message.setLatitude(latitude);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
