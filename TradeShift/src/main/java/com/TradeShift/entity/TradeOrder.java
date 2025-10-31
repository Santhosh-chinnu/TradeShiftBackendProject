package com.TradeShift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "trade_orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TradeOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;
    private String side; // BUY or SELL
    private String status; // PENDING / FILLED / REJECTED
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
