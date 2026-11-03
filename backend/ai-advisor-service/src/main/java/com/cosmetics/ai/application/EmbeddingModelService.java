package com.cosmetics.ai.application;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

@Service
public class EmbeddingModelService {
    public static final int VECTOR_DIM = 384;

    public float[] generateEmbedding(String text) {
        if (text == null) text = "";
        float[] vector = new float[VECTOR_DIM];
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(text.toLowerCase().trim().getBytes(StandardCharsets.UTF_8));

            // Populate vector dimensions using hash and character n-grams
            for (int i = 0; i < VECTOR_DIM; i++) {
                byte b = hash[i % hash.length];
                float val = ((b & 0xFF) - 128.0f) / 128.0f;
                // Add n-gram context
                if (text.length() > i) {
                    val += (text.charAt(i % text.length()) % 31) / 31.0f;
                }
                vector[i] = val;
            }

            // Normalize vector to unit length (L2 norm) for Cosine similarity
            float sumSquares = 0.0f;
            for (float v : vector) {
                sumSquares += v * v;
            }
            float norm = (float) Math.sqrt(sumSquares);
            if (norm > 0) {
                for (int i = 0; i < VECTOR_DIM; i++) {
                    vector[i] /= norm;
                }
            }
        } catch (NoSuchAlgorithmException e) {
            Arrays.fill(vector, 0.01f);
        }
        return vector;
    }
}
