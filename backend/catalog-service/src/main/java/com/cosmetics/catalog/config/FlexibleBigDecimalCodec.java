package com.cosmetics.catalog.config;

import org.bson.BsonReader;
import org.bson.BsonType;
import org.bson.BsonWriter;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;
import org.bson.types.Decimal128;

import java.math.BigDecimal;

public class FlexibleBigDecimalCodec implements Codec<BigDecimal> {
    @Override
    public BigDecimal decode(BsonReader reader, DecoderContext decoderContext) {
        BsonType currentType = reader.getCurrentBsonType();
        if (currentType == BsonType.DECIMAL128) {
            return reader.readDecimal128().bigDecimalValue();
        } else if (currentType == BsonType.STRING) {
            String s = reader.readString();
            try {
                return new BigDecimal(s.trim());
            } catch (Exception e) {
                return BigDecimal.ZERO;
            }
        } else if (currentType == BsonType.DOUBLE) {
            return BigDecimal.valueOf(reader.readDouble());
        } else if (currentType == BsonType.INT32) {
            return BigDecimal.valueOf(reader.readInt32());
        } else if (currentType == BsonType.INT64) {
            return BigDecimal.valueOf(reader.readInt64());
        } else if (currentType == BsonType.NULL) {
            reader.readNull();
            return null;
        } else {
            reader.skipValue();
            return BigDecimal.ZERO;
        }
    }

    @Override
    public void encode(BsonWriter writer, BigDecimal value, EncoderContext encoderContext) {
        if (value == null) {
            writer.writeNull();
        } else {
            writer.writeDecimal128(new Decimal128(value));
        }
    }

    @Override
    public Class<BigDecimal> getEncoderClass() {
        return BigDecimal.class;
    }
}
