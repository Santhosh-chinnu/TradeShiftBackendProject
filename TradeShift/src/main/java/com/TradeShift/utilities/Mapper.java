package com.TradeShift.utilities;

import com.TradeShift.dto.*;
import com.TradeShift.entity.Asset;
import com.TradeShift.entity.Portfolio;
import com.TradeShift.entity.TradeOrder;

import java.util.stream.Collectors;

public class Mapper {

    public static AssetDto toAssetDto(Asset a) {
        AssetDto dto = new AssetDto();
        dto.setId(a.getId());
        dto.setSymbol(a.getSymbol());
        dto.setAssetType(a.getAssetType());
        dto.setQuantity(a.getQuantity());
        dto.setAvgPrice(a.getAvgPrice());
        return dto;
    }

    public static Asset toAssetEntity(AssetDto dto) {
        Asset a = new Asset();
        a.setId(dto.getId());
        a.setSymbol(dto.getSymbol());
        a.setAssetType(dto.getAssetType());
        a.setQuantity(dto.getQuantity());
        a.setAvgPrice(dto.getAvgPrice());
        return a;
    }

    public static PortfolioDto toPortfolioDto(Portfolio p) {
        PortfolioDto dto = new PortfolioDto();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setAssets(p.getAssets().stream().map(Mapper::toAssetDto).collect(Collectors.toList()));
        return dto;
    }

    public static TradeOrderDto toTradeOrderDto(TradeOrder o) {
        TradeOrderDto dto = new TradeOrderDto();
        dto.setId(o.getId());
        dto.setSymbol(o.getSymbol());
        dto.setQuantity(o.getQuantity());
        dto.setPrice(o.getPrice());
        dto.setSide(o.getSide());
        dto.setStatus(o.getStatus());
        dto.setCreatedAt(o.getCreatedAt());
        return dto;
    }
}
