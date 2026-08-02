package com.ecommerce.order.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    /**
     * Plain RestTemplate for now. In phase 2 this synchronous call is replaced by an
     * OpenFeign client resolved through Eureka, and wrapped in a Resilience4j circuit
     * breaker so a slow/down product-service can't cascade into order-service.
     *
     * Timeouts are configurable because on free-tier hosting (Render, etc.) a sleeping
     * service can take 30-60s to cold-start. The defaults here are generous enough to
     * survive that; locally, where both services are always warm, requests still return
     * in milliseconds regardless of how high the ceiling is.
     */
    @Bean
    public RestTemplate restTemplate(
            RestTemplateBuilder builder,
            @Value("${services.product-service.connect-timeout-ms:10000}") long connectTimeoutMs,
            @Value("${services.product-service.read-timeout-ms:45000}") long readTimeoutMs) {
        return builder
                .connectTimeout(Duration.ofMillis(connectTimeoutMs))
                .readTimeout(Duration.ofMillis(readTimeoutMs))
                .build();
    }
}
