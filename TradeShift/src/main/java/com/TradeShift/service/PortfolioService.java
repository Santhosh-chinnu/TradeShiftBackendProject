package com.TradeShift.service;

import com.TradeShift.dto.AssetDto;
import com.TradeShift.dto.PortfolioDto;
import com.TradeShift.entity.Asset;
import com.TradeShift.entity.Portfolio;
import com.TradeShift.entity.User;
import com.TradeShift.repository.PortfolioRepository;
import com.TradeShift.repository.UserRepository;
import com.TradeShift.utilities.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    @Autowired
    private final PortfolioRepository portfolioRepository;

    @Autowired
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }
    public List<PortfolioDto> getPortfoliosForUsername(String username) {
        User u = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return portfolioRepository.findByOwner(u).stream().map(Mapper::toPortfolioDto).collect(Collectors.toList());
    }

    @Transactional
    public PortfolioDto createPortfolio(String username, PortfolioDto dto) {
        User u = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Portfolio p = new Portfolio();
        p.setName(dto.getName());
        p.setOwner(u);
        if (dto.getAssets() != null) {
            for (AssetDto a : dto.getAssets()) {
                Asset asset = Mapper.toAssetEntity(a);
                p.getAssets().add(asset);
            }
        }
        Portfolio saved = portfolioRepository.save(p);
        return Mapper.toPortfolioDto(saved);
    }

    @Transactional
    public PortfolioDto addAsset(Long portfolioId, AssetDto assetDto) {
        Portfolio p = portfolioRepository.findById(portfolioId).orElseThrow(() -> new RuntimeException("Portfolio not found"));
        Asset a = Mapper.toAssetEntity(assetDto);
        p.getAssets().add(a);
        Portfolio saved = portfolioRepository.save(p);
        return Mapper.toPortfolioDto(saved);
    }
}
