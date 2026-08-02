package com.ecommerce.product.config;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.saveAll(List.of(
                Product.builder().name("Mechanical Keyboard")
                        .description("Hot-swappable 75% mechanical keyboard with brown switches")
                        .price(new BigDecimal("79.99")).category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1595225476474-89031d3c7016?w=400")
                        .stockQuantity(50).build(),
                Product.builder().name("Wireless Mouse")
                        .description("Ergonomic wireless mouse with 6-month battery life")
                        .price(new BigDecimal("29.99")).category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400")
                        .stockQuantity(120).build(),
                Product.builder().name("27-inch 4K Monitor")
                        .description("IPS panel, 99% sRGB, USB-C connectivity")
                        .price(new BigDecimal("349.00")).category("Electronics")
                        .imageUrl("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400")
                        .stockQuantity(20).build(),
                Product.builder().name("Cotton T-Shirt")
                        .description("100% organic cotton, regular fit")
                        .price(new BigDecimal("19.99")).category("Apparel")
                        .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400")
                        .stockQuantity(200).build(),
                Product.builder().name("Running Shoes")
                        .description("Lightweight breathable mesh, cushioned sole")
                        .price(new BigDecimal("89.50")).category("Apparel")
                        .imageUrl("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")
                        .stockQuantity(75).build(),
                Product.builder().name("Stainless Steel Water Bottle")
                        .description("Insulated, keeps drinks cold for 24 hours")
                        .price(new BigDecimal("24.99")).category("Home")
                        .imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400")
                        .stockQuantity(150).build(),
                Product.builder().name("Ceramic Coffee Mug Set")
                        .description("Set of 4, dishwasher and microwave safe")
                        .price(new BigDecimal("34.99")).category("Home")
                        .imageUrl("https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400")
                        .stockQuantity(90).build(),
                Product.builder().name("Yoga Mat")
                        .description("Non-slip, 6mm thick, includes carry strap")
                        .price(new BigDecimal("39.99")).category("Fitness")
                        .imageUrl("https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400")
                        .stockQuantity(60).build()
        ));
    }
}
