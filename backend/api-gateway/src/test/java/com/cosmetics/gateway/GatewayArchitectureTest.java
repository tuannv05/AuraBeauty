package com.cosmetics.gateway;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class GatewayArchitectureTest {

    private final JavaClasses importedClasses = new ClassFileImporter().importPackages("com.cosmetics.gateway");

    @Test
    @DisplayName("API Gateway must not depend on Spring Framework (Quarkus Migration Rule)")
    void gatewayMustNotDependOnSpring() {
        ArchRule rule = noClasses()
                .that().resideInAPackage("com.cosmetics.gateway..")
                .should().dependOnClassesThat()
                .resideInAnyPackage("org.springframework..");

        rule.check(importedClasses);
    }
}
