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

type Recv = () => Promise<number>;
type Send = (bytes: Uint8Array) => Promise<boolean>;

const bufferOf = (buffer: Buffer, value: number) =>
    Buffer.concat([buffer, Buffer.from([value])]);

export class WirelessLinkReceiveMessage {
    constructor(private readonly message: Message) { /* empty */ }

    containsMessage() {
        return this.message.payload[0] === 1;
    }

    body() {
        return this.message.payload.slice(1, 62);
    }

    rssi() {
        return this.message.payload.readInt16BE(this.message.payload.length - 2);
    }
}

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
            this._parseMessage(new MessageStateStarted(), Buffer.alloc(0)));
    }

    send(buffer: Buffer) {
        return this._send(new Message(0x04, buffer).buffer()).then(_ =>
            this._parseMessage(new MessageStateStarted(), Buffer.alloc(0)));
    }

    recv() {
        return this._send(new Message(0x03, Buffer.alloc(1)).buffer())
            .then(_ => this._parseMessage(new MessageStateStarted(), Buffer.alloc(0)))
            .then(m => Promise.resolve(new WirelessLinkReceiveMessage(m)));
    }

    private _parseMessage(state: MessageState, buffer: Buffer): Promise<Message> {
        const error = new Message(0x0F, Buffer.alloc(<number> this._commands.get(0x0F)));
        return this._recv().then(byte =>
            match<MessageState, Promise<Message>>(state,
                _(() => Promise.reject(error)),
                when(MessageStateStarted, () => {
                    if (byte === 0xAA) {
                        return this._parseMessage(new MessageStateCommand(), bufferOf(buffer, byte));
                    } else {
                        return this._parseMessage(new MessageStateStarted(), Buffer.alloc(0));
                    }
                }),
                when(MessageStateCommand, () => {
                    if (this._commands.get(byte)) {
                        return this._parseMessage(new MessageStatePayload(), bufferOf(buffer, byte));
                    } else {
                        return this._parseMessage(new MessageStateStarted(), Buffer.alloc(0));
                    }
                }),
                when(MessageStatePayload, () => {
                    const payloadSize = this._commands.get(buffer[1]);
                    const newBuffer = bufferOf(buffer, byte);
                    if (newBuffer.length === (payloadSize + 2)) {
                        return this._parseMessage(new MessageStateChecksum(), newBuffer);
                    } else {
                        return this._parseMessage(new MessageStatePayload(), newBuffer);
                    }
                }),
                when(MessageStateChecksum, () => {
                    const payloadSize = this._commands.get(buffer[1]);
                    const newBuffer = bufferOf(buffer, byte);
                    if (newBuffer.length === (payloadSize + 4)) {
                        return Promise.resolve(Message.from(newBuffer));
                    } else {
                        return this._parseMessage(new MessageStateChecksum(), newBuffer);
                    }
                }),
            ),
        );
    }
}
