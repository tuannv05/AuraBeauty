package com.cosmetics.catalog.config;

import jakarta.enterprise.context.ApplicationScoped;
import org.bson.codecs.Codec;
import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@ApplicationScoped
public class BigDecimalCodecProvider implements CodecProvider {
    @Override
    @SuppressWarnings("unchecked")
    public <T> Codec<T> get(Class<T> clazz, CodecRegistry registry) {
        if (clazz == BigDecimal.class) {
            return (Codec<T>) new FlexibleBigDecimalCodec();
        } else if (clazz == UUID.class) {
            return (Codec<T>) new FlexibleUuidCodec();
        } else if (clazz == Instant.class) {
            return (Codec<T>) new FlexibleInstantCodec();
        } else if (clazz == String.class) {
            return (Codec<T>) new FlexibleStringCodec();
        } else if (clazz.isEnum()) {
            return (Codec<T>) new CaseInsensitiveEnumCodec(clazz);
        }
        return null;
    }
}
