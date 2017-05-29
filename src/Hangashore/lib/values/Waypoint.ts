const {Waypoint: WaypointProtobuf, TypedMessage} = require(`@lakemaps/schemas`);

export class Waypoint {
    static decode(buf: Buffer): Waypoint {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        return Waypoint.fromMessage(TypedMessage.deserializeBinary(bytes).getWaypoint());
    }

    static fromMessage(obj: any) {
        return new Waypoint(obj.getLongitude(), obj.getLatitude());
    }

    private message: any;

    constructor(readonly longitude: number, readonly latitude: number) {
        const waypoint = new WaypointProtobuf();
        waypoint.setLongitude(longitude);
        waypoint.setLatitude(latitude);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.WAYPOINT);
        this.message.setWaypoint(waypoint);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
