package com.cosmetics.catalog.config;

import org.bson.BsonReader;
import org.bson.BsonType;
import org.bson.BsonWriter;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;
import org.bson.internal.UuidHelper;

import java.util.UUID;

public class FlexibleUuidCodec implements Codec<UUID> {
    @Override
    public UUID decode(BsonReader reader, DecoderContext decoderContext) {
        BsonType currentType = reader.getCurrentBsonType();
        if (currentType == BsonType.STRING) {
            String s = reader.readString();
            try {
                return UUID.fromString(s.trim());
            } catch (Exception e) {
                return null;
            }
        } else if (currentType == BsonType.BINARY) {
            byte subType = reader.peekBinarySubType();
            byte[] bytes = reader.readBinaryData().getData();
            try {
                return UuidHelper.decodeBinaryToUuid(bytes, subType, org.bson.UuidRepresentation.JAVA_LEGACY);
            } catch (Exception e1) {
                try {
                    return UuidHelper.decodeBinaryToUuid(bytes, subType, org.bson.UuidRepresentation.STANDARD);
                } catch (Exception e2) {
                    return null;
                }
            }
        } else if (currentType == BsonType.NULL) {
            reader.readNull();
            return null;
        } else {
            reader.skipValue();
            return null;
        }
    }

    @Override
    public void encode(BsonWriter writer, UUID value, EncoderContext encoderContext) {
        if (value == null) {
            writer.writeNull();
        } else {
            writer.writeString(value.toString());
        }
    }

    @Override
    public Class<UUID> getEncoderClass() {
        return UUID.class;
    }
}
