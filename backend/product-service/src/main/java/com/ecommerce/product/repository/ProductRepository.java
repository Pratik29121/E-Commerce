package com.ecommerce.product.repository;

import com.ecommerce.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
            SELECT p FROM Product p
            WHERE (:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%'))
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%', CAST(:keyword AS string), '%')))
              AND (:category IS NULL OR p.category = CAST(:category AS string))
            """)
    Page<Product> search(@Param("keyword") String keyword,
                          @Param("category") String category,
                          Pageable pageable);
}
