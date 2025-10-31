package com.TradeShift.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Random;

@Service
public class MarketDataService {
    private final Random rnd = new Random();

    public BigDecimal getPrice(String symbol) {
        // deterministic-ish mock price: base on symbol hash
        int base = Math.abs(symbol.hashCode() % 1000) + 50;
        double noise = rnd.nextDouble() * 10 - 5;
        return BigDecimal.valueOf(base + noise).setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    public Map<String, BigDecimal> getPricesForSymbols(Iterable<String> symbols) {
        return Map.of(); // keep simple; methods above can be used to fetch per symbol
    }
}
