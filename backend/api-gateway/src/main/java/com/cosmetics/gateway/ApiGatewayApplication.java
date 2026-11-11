package com.cosmetics.gateway;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class ApiGatewayApplication {
    public static void main(String[] args) {
        Quarkus.run(args);
    }
}
