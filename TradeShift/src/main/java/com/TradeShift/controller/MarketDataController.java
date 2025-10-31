package com.TradeShift.controller;

import com.TradeShift.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/market")
public class MarketDataController {
    @Autowired
    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService; }

    @GetMapping("/price/{symbol}")
    public ResponseEntity<BigDecimal> getPrice(@PathVariable String symbol) {
        return ResponseEntity.ok(marketDataService.getPrice(symbol.toUpperCase()));
    }
}
