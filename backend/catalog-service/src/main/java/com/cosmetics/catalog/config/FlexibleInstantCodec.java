package com.cosmetics.catalog.config;

import org.bson.BsonReader;
import org.bson.BsonType;
import org.bson.BsonWriter;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;

import java.time.Instant;

public class FlexibleInstantCodec implements Codec<Instant> {
    @Override
    public Instant decode(BsonReader reader, DecoderContext decoderContext) {
        BsonType currentType = reader.getCurrentBsonType();
        if (currentType == BsonType.DATE_TIME) {
            return Instant.ofEpochMilli(reader.readDateTime());
        } else if (currentType == BsonType.STRING) {
            String s = reader.readString();
            try {
                return Instant.parse(s.trim());
            } catch (Exception e) {
                return Instant.now();
            }
        } else if (currentType == BsonType.INT64) {
            return Instant.ofEpochMilli(reader.readInt64());
        } else if (currentType == BsonType.NULL) {
            reader.readNull();
            return null;
        } else {
            reader.skipValue();
            return null;
        }
    }

    @Override
    public void encode(BsonWriter writer, Instant value, EncoderContext encoderContext) {
        if (value == null) {
            writer.writeNull();
        } else {
            writer.writeDateTime(value.toEpochMilli());
        }
    }

    @Override
    public Class<Instant> getEncoderClass() {
        return Instant.class;
    }
}
