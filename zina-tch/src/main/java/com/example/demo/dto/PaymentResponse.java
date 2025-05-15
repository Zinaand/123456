package com.example.demo.dto;

import com.example.demo.entity.Payment.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    
    // 支付订单ID
    private Long paymentId;
    
    // 外部支付单号
    private String outTradeNo;
    
    // 支付金额
    private BigDecimal amount;
    
    // 支付状态
    private PaymentStatus status;
    
    // 二维码URL (微信支付和支付宝支付)
    private String qrCodeUrl;
    
    // 支付页面URL (支付宝手机网页支付)
    private String payUrl;
    
    // 支付创建时间
    private LocalDateTime createdTime;
    
    // 支付过期时间
    private LocalDateTime expireTime;
}