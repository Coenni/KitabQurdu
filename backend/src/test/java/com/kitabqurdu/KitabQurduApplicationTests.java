package com.kitabqurdu;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "jwt.secret=test-secret-key-for-testing-purposes-must-be-at-least-256-bits-long",
    "spring.security.oauth2.client.registration.google.client-id=test",
    "spring.security.oauth2.client.registration.google.client-secret=test",
    "spring.security.oauth2.client.registration.facebook.client-id=test",
    "spring.security.oauth2.client.registration.facebook.client-secret=test"
})
class KitabQurduApplicationTests {

    @Test
    void contextLoads() {
        // Test that the Spring context loads successfully
    }
}
