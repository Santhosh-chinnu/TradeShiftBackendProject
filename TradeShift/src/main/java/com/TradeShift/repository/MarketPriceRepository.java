package com.TradeShift.repository;

import com.TradeShift.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {
    Optional<MarketPrice> findFirstBySymbolOrderByFetchedAtDesc(String symbol);
}
