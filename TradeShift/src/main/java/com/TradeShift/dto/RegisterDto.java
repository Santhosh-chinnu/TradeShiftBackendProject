package com.TradeShift.dto;

import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String name;
    private String email;
    private String password;
    private String contactNo;
}
