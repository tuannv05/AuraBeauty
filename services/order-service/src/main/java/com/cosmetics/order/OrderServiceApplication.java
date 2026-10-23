package com.cosmetics.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.cosmetics.order", "com.cosmetics.common"})
@EnableR2dbcRepositories(basePackages = {
        "com.cosmetics.order.adapter.out.persistence",
        "com.cosmetics.common.outbox"
})
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
