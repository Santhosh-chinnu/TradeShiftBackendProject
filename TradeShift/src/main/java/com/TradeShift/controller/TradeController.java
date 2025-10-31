package com.TradeShift.controller;

import com.TradeShift.dto.PlaceOrderDto;
import com.TradeShift.dto.TradeOrderDto;
import com.TradeShift.service.TradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trades")
public class TradeController {

    @Autowired
    private final TradeService tradeService;

    public TradeController(TradeService tradeService) {
        this.tradeService = tradeService; }

    @PostMapping
    public ResponseEntity<TradeOrderDto> placeOrder(Authentication auth, @RequestBody PlaceOrderDto dto) {
        TradeOrderDto res = tradeService.placeOrder(auth.getName(), dto);
        return ResponseEntity.status(201).body(res);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TradeOrderDto> getOrder(@PathVariable Long id) {
        return ResponseEntity.ok(tradeService.getOrder(id));
    }
}
