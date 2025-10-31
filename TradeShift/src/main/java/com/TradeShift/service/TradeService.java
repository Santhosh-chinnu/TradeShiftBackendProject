package com.TradeShift.service;

import com.TradeShift.dto.PlaceOrderDto;
import com.TradeShift.entity.TradeOrder;
import com.TradeShift.entity.User;
import com.TradeShift.repository.TradeOrderRepository;
import com.TradeShift.repository.UserRepository;
import com.TradeShift.utilities.Mapper;
import com.TradeShift.dto.TradeOrderDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class TradeService {
    @Autowired
    private final TradeOrderRepository tradeOrderRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final MarketDataService marketDataService;

    public TradeService(TradeOrderRepository tradeOrderRepository,
                        UserRepository userRepository,
                        MarketDataService marketDataService) {
        this.tradeOrderRepository = tradeOrderRepository;
        this.userRepository = userRepository;
        this.marketDataService = marketDataService;
    }

    @Transactional
    public TradeOrderDto placeOrder(String username, PlaceOrderDto dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        BigDecimal price = marketDataService.getPrice(dto.getSymbol());
        TradeOrder order = TradeOrder.builder()
                .symbol(dto.getSymbol())
                .quantity(dto.getQuantity())
                .price(price)
                .side(dto.getSide())
                .status("PENDING")
                .createdAt(Instant.now())
                .user(user)
                .build();
        tradeOrderRepository.save(order);

        // mock broker execution: accept all BUY orders, for SELL also accept for simplicity
        order.setStatus("FILLED");
        tradeOrderRepository.save(order);

        return Mapper.toTradeOrderDto(order);
    }

    public TradeOrderDto getOrder(Long id) {
        TradeOrder o = tradeOrderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return Mapper.toTradeOrderDto(o);
    }
}
