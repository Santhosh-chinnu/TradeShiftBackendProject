package com.TradeShift.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String symbol; // e.g. AAPL
    private String assetType; // STOCK, ETF etc.
    private BigDecimal quantity;
    private BigDecimal avgPrice; // purchase avg price
}
