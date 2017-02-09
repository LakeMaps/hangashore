import {EventEmitter} from 'events';
import * as NodeSerialPort from 'serialport';

type PendingReadResolve = (byte: number) => void;

export class SerialPort {
    private readonly _port: NodeSerialPort;

    private _pendingReads: PendingReadResolve[];

    constructor(port: string, baudRate: number = 115200) {
        this._port = new NodeSerialPort(port, {
            baudRate,
            parser: this._parser(),
        });
    }

    send(buffer: Buffer) {
        return new Promise<boolean>((resolve, reject) => {
            this._port.write(buffer, (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    }

    recv(): Promise<number> {
        return new Promise<number>((resolve: PendingReadResolve) => {
            this._pendingReads.push(resolve);
        });
    }

    _parser() {
        let data = new Buffer(0);
        return (_: EventEmitter, buffer: Buffer) => {
            data = Buffer.concat([data, buffer]);
            while (data.length) {
                const nextByte = data[0];
                const nextRead = this._pendingReads.shift();

                if (!nextRead) {
                    return;
                }

                nextRead(nextByte);
                data = data.slice(1);
            }
        };
    }
}
