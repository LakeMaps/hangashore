import {EventEmitter} from 'events';
import * as NodeSerialPort from 'serialport';

type PendingRead = (byte: number) => void;

export class SerialPort {
    private readonly _port: NodeSerialPort;

    private _pendingReads: PendingRead[] = [];

    private _buffer = Buffer.alloc(0);

    constructor(port: string, baudRate: number = 57600) {
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
        return new Promise<number>((resolve: PendingRead) => {
            if (!this._buffer.length) {
                this._pendingReads.push(resolve);
                return;
            }

            const nextByte = this._buffer[0];

            this._buffer = this._buffer.slice(1);
            resolve(nextByte);
        });
    }

    _parser() {
        return (_: EventEmitter, buffer: Buffer) => {
            this._buffer = Buffer.concat([this._buffer, buffer]);
            while (this._buffer.length) {
                const nextByte = this._buffer[0];
                const nextRead = this._pendingReads.shift();

                if (!nextRead) {
                    return;
                }

                this._buffer = this._buffer.slice(1);
                nextRead(nextByte);
            }
        };
    }
}
