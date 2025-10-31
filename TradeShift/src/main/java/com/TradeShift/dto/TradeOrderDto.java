package com.TradeShift.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
public class TradeOrderDto {
    private Long id;
    private String symbol;
    private BigDecimal quantity;
    private BigDecimal price;
    private String side;
    private String status;
    private Instant createdAt;
}
