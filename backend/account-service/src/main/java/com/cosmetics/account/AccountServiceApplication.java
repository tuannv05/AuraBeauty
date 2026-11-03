package com.cosmetics.account;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.cosmetics.account", "com.cosmetics.common"})
@EnableR2dbcRepositories(basePackages = {
        "com.cosmetics.account.adapter.out.persistence",
        "com.cosmetics.common.outbox"
})
public class AccountServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AccountServiceApplication.class, args);
    }
}
