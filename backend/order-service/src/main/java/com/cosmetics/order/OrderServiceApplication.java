package com.cosmetics.order;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class OrderServiceApplication {
    public static void main(String[] args) {
        Quarkus.run(args);
    }
}
