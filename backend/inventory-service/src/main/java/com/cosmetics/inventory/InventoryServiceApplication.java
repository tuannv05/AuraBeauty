package com.cosmetics.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.cosmetics.inventory", "com.cosmetics.common"})
@EnableR2dbcRepositories(basePackages = {
        "com.cosmetics.inventory.adapter.out.persistence",
        "com.cosmetics.common.outbox"
})
public class InventoryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}
