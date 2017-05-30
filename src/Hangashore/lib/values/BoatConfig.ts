import {PidControllerGains} from './PidControllerGains';

const {
    BoatConfig: BoatConfigProtobuf,
    TypedMessage,
    PidControllerGains: PidControllerGainsProtobuf,
} = require(`@lakemaps/schemas`);

export class BoatConfig {
    static decode(buf: Buffer): BoatConfig {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = TypedMessage.deserializeBinary(bytes).getBoatConfig();
        const surgeControllerGains = obj.getSurgeControllerGains();
        const surgeTimeStep = obj.getSurgeControllerDt();
        const yawControllerGains = obj.getYawControllerGains();
        const yawTimeStep = obj.getYawControllerDt();
        return new BoatConfig(
            new PidControllerGains(
                surgeControllerGains.getKp(),
                surgeControllerGains.getKi(),
                surgeControllerGains.getKd(),
            ),
            surgeTimeStep,
            new PidControllerGains(
                yawControllerGains.getKp(),
                yawControllerGains.getKi(),
                yawControllerGains.getKd(),
            ),
            yawTimeStep,
        );
    }

    private message: any;

    constructor(
        readonly surgeGains: PidControllerGains,
        readonly surgeTimeStep: number,
        readonly yawGains: PidControllerGains,
        readonly yawTimeStep: number,
    ) {
        const surgeControllerGains = new PidControllerGainsProtobuf();
        surgeControllerGains.setKp(surgeGains.kp);
        surgeControllerGains.setKi(surgeGains.ki);
        surgeControllerGains.setKd(surgeGains.kd);
        const yawControllerGains = new PidControllerGainsProtobuf();
        yawControllerGains.setKp(yawGains.kp);
        yawControllerGains.setKi(yawGains.ki);
        yawControllerGains.setKd(yawGains.kd);
        const boatConfig = new BoatConfigProtobuf();
        boatConfig.setSurgeControllerGains(surgeControllerGains);
        boatConfig.setSurgeControllerDt(surgeTimeStep);
        boatConfig.setYawControllerGains(yawControllerGains);
        boatConfig.setYawControllerDt(yawTimeStep);
        this.message = new TypedMessage();
        this.message.setType(TypedMessage.Type.BOAT_CONFIG);
        this.message.setBoatConfig(boatConfig);
    }

    encode(): Buffer {
        return Buffer.from(this.message.serializeBinary());
    }
}
