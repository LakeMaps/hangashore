import {crc16} from './Checksum';

export class Message {
    static from(buffer: Buffer) {
        return new Message(buffer[1], buffer.slice(2, buffer.length - 2));
    }

    constructor(readonly command: number, readonly payload: Buffer) { /* empty */ }

    buffer(): Buffer {
        const msg = Buffer.concat([Buffer.from([0xAA, this.command]), this.payload]);
        return Buffer.concat([msg, crc16(msg)]);
    }
}
