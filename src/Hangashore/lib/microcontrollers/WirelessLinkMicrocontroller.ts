import {Case as when, DefaultCase as _, match} from 'ts-match';

import {Message} from './Message';
import {
    MessageState,
    MessageStateChecksum,
    MessageStateCommand,
    MessageStatePayload,
    MessageStateStarted,
} from './MessageState';
import {SerialPort} from './serial/SerialPort';

type Resolve<T> = (value: T) => void;
type Recv = () => Promise<number>;
type Send = (bytes: Uint8Array) => Promise<boolean>;

const bufferOf = (buffer: Buffer, value: number) =>
    Buffer.concat([buffer, Buffer.from([value])]);

export class WirelessLinkMicrocontroller {
    static fromSerialPort(name: string) {
        const port = new SerialPort(name);
        return new WirelessLinkMicrocontroller(port.recv.bind(port), port.send.bind(port));
    }

    private readonly _commands = new Map([
        [0x00,  1],
        [0x03, 64],
        [0x04,  1],
        [0x0F,  1],
    ]);

    private readonly _recv: Recv;

    private readonly _send: Send;

    constructor(recv: Recv, send: Send) {
        this._recv = recv;
        this._send = send;
    }

    reset() {
        return this._send(new Message(0x00, Buffer.alloc(1)).buffer()).then(_ =>
            new Promise<Message>((resolve: Resolve<Message>) =>
                this._parseMessage(new MessageStateStarted(), Buffer.alloc(0), resolve)));
    }

    send(buffer: Buffer): Promise<Message> {
        return this._send(new Message(0x04, buffer).buffer()).then(_ =>
            new Promise<Message>((resolve: Resolve<Message>) =>
                this._parseMessage(new MessageStateStarted(), Buffer.alloc(0), resolve)));
    }

    recv(): Promise<Message> {
        return this._send(new Message(0x03, Buffer.alloc(1)).buffer()).then(_ =>
            new Promise<Message>((resolve: Resolve<Message>) =>
                this._parseMessage(new MessageStateStarted(), Buffer.alloc(0), resolve)));
    }

    private _parseMessage(state: MessageState, buffer: Buffer, done: Resolve<Message>) {
        this._recv().then(byte => {
            match<MessageState, void>(state,
                _(),
                when(MessageStateStarted, () => {
                    if (byte === 0xAA) {
                        this._parseMessage(new MessageStateCommand(), bufferOf(buffer, byte), done);
                    } else {
                        this._parseMessage(new MessageStateStarted(), Buffer.alloc(0), done);
                    }
                }),
                when(MessageStateCommand, () => {
                    if (this._commands.get(byte)) {
                        this._parseMessage(new MessageStatePayload(), bufferOf(buffer, byte), done);
                    } else {
                        this._parseMessage(new MessageStateStarted(), Buffer.alloc(0), done);
                    }
                }),
                when(MessageStatePayload, () => {
                    const payloadSize = this._commands.get(buffer[1]);
                    const newBuffer = bufferOf(buffer, byte);
                    if (newBuffer.length === (payloadSize + 2)) {
                        this._parseMessage(new MessageStateChecksum(), newBuffer, done);
                    } else {
                        this._parseMessage(new MessageStatePayload(), newBuffer, done);
                    }
                }),
                when(MessageStateChecksum, () => {
                    const payloadSize = this._commands.get(buffer[1]);
                    const newBuffer = bufferOf(buffer, byte);
                    if (newBuffer.length === (payloadSize + 4)) {
                        done(Message.from(newBuffer));
                    } else {
                        this._parseMessage(new MessageStateChecksum(), newBuffer, done);
                    }
                }),
            );
        });
    }
}
