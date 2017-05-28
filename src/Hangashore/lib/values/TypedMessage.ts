const {TypedMessage: TypedMessageProtobuf} = require(`@lakemaps/schemas`);

export class TypedMessage {
    static decode(buf: Buffer): TypedMessage {
        const bytes = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
        const obj = TypedMessageProtobuf.deserializeBinary(bytes);
        return new TypedMessage(obj.getType());
    }

    private constructor(private readonly type: any) {/* empty */}

    isGps() {
        return this.type === TypedMessageProtobuf.Type.GPS;
    }
}
