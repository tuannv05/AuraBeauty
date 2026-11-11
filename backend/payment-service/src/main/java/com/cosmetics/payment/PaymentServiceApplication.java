package com.cosmetics.payment;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class PaymentServiceApplication {
    public static void main(String[] args) {
        Quarkus.run(args);
    }
}
