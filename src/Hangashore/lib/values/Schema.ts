import * as fs from 'fs';
import * as path from 'path';

const protobuf = require(`protocol-buffers`);

export class Schema<T> {
    static of<X>(name: string) {
        return new Schema<X>(path.join(__dirname, `schemas/src/`, name));
    }

    private lazySchema: Promise<any>;

    constructor(filename: string) {
        this.lazySchema = new Promise((resolve, reject) => {
            fs.readFile(filename, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(protobuf(data));
            });
        });
    }

    encode(val: T): Promise<Buffer> {
        return this.lazySchema.then(schema => schema.encode(val));
    }

    decode(buf: Buffer): Promise<T> {
        return this.lazySchema.then(schema => schema.decode(buf));
    }
}
