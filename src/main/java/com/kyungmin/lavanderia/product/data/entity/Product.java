package com.kyungmin.lavanderia.product.data.entity;

import com.kyungmin.lavanderia.cart.data.entity.Cart;
import com.kyungmin.lavanderia.order.data.entity.Order;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.util.List;

@Entity
@Getter
@Setter
@DynamicInsert
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "TBL_PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PRODUCT_ID")
    private Long productId; // 상품 아이디

    @Column(name = "PRODUCT_NAME")
    private String productName; // 상품 이름

    @Column(name = "PRODUCT_PRICE")
    private Long productPrice; // 상품 가격

    @Column(name = "PRODUCT_DESCRIPTION")
    private String productDescription; // 상품 설명

    @Column(name = "PRODUCT_IMAGE")
    private String productImage; // 상품 이미지

    @OneToMany(mappedBy = "product")
    private List<Order> orderList;

    @OneToMany(mappedBy = "product")
    private List<Cart> cartList;

}
