package com.TradeShift.repository;

import com.TradeShift.entity.Portfolio;
import com.TradeShift.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByOwner(User owner);
}
