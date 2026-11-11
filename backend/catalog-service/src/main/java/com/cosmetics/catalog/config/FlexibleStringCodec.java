package com.cosmetics.catalog.config;

import org.bson.BsonReader;
import org.bson.BsonType;
import org.bson.BsonWriter;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;

public class FlexibleStringCodec implements Codec<String> {
    @Override
    public String decode(BsonReader reader, DecoderContext decoderContext) {
        BsonType currentType = reader.getCurrentBsonType();
        if (currentType == BsonType.STRING) {
            return reader.readString();
        } else if (currentType == BsonType.OBJECT_ID) {
            return reader.readObjectId().toHexString();
        } else if (currentType == BsonType.SYMBOL) {
            return reader.readSymbol();
        } else if (currentType == BsonType.INT32) {
            return String.valueOf(reader.readInt32());
        } else if (currentType == BsonType.INT64) {
            return String.valueOf(reader.readInt64());
        } else if (currentType == BsonType.DOUBLE) {
            return String.valueOf(reader.readDouble());
        } else if (currentType == BsonType.BOOLEAN) {
            return String.valueOf(reader.readBoolean());
        } else if (currentType == BsonType.NULL) {
            reader.readNull();
            return null;
        } else {
            reader.skipValue();
            return null;
        }
    }

    @Override
    public void encode(BsonWriter writer, String value, EncoderContext encoderContext) {
        if (value == null) {
            writer.writeNull();
        } else {
            writer.writeString(value);
        }
    }

    @Override
    public Class<String> getEncoderClass() {
        return String.class;
    }
}
