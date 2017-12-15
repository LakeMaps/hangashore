import {MissionInformation as MissionInformationProtobuf, TypedMessage} from '@lakemaps/schemas';

export class MissionInformation {
    static decode(buf: Buffer): MissionInformation {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = TypedMessage.deserializeBinary(bytes).getMissionInformation();
        if (obj === null) {
            throw new Error(`Missing MissionInformation field`);
        }

        return new MissionInformation(obj.getDistanceToWaypoint());
    }

    private message: any;

    constructor(readonly distanceToWaypoint: number) {
        const missionInformation = new MissionInformationProtobuf();
        missionInformation.setDistanceToWaypoint(distanceToWaypoint);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.MISSION_INFORMATION);
        this.message.setMissionInformation(missionInformation);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
