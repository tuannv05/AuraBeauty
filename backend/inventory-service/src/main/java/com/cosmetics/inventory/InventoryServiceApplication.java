package com.cosmetics.inventory;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class InventoryServiceApplication {
    public static void main(String... args) {
        Quarkus.run(args);
    }
}
