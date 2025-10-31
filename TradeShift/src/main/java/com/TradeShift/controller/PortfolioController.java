package com.TradeShift.controller;

import com.TradeShift.dto.AssetDto;
import com.TradeShift.dto.PortfolioDto;
import com.TradeShift.service.PortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    @Autowired
    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService)
    { this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<List<PortfolioDto>> getForUser(Authentication auth) {
        return ResponseEntity.ok(portfolioService.getPortfoliosForUsername(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<PortfolioDto> create(Authentication auth, @RequestBody PortfolioDto dto) {
        return ResponseEntity.status(201).body(portfolioService.createPortfolio(auth.getName(), dto));
    }

    @PostMapping("/{id}/assets")
    public ResponseEntity<PortfolioDto> addAsset(@PathVariable Long id, @RequestBody AssetDto assetDto) {
        return ResponseEntity.ok(portfolioService.addAsset(id, assetDto));
    }
}
