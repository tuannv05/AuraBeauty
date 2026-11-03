package com.cosmetics.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.cosmetics.ai", "com.cosmetics.common"})
@EnableR2dbcRepositories(basePackages = "com.cosmetics.ai.adapter.out.persistence")
public class AiAdvisorServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiAdvisorServiceApplication.class, args);
    }
}
