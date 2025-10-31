package com.TradeShift.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PlaceOrderDto {
    private String symbol;
    private BigDecimal quantity;
    private String side; // BUY or SELL
}
