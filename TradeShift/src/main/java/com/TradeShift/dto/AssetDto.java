package com.TradeShift.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class AssetDto {
    private Long id;
    private String symbol;
    private String assetType;
    private BigDecimal quantity;
    private BigDecimal avgPrice;
}
