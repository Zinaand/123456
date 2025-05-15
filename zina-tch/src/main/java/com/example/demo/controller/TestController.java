package com.example.demo.controller;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.entity.Payment;
import com.example.demo.service.PaymentService;
import com.example.demo.util.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    private static final Logger log = LoggerFactory.getLogger(TestController.class);
    
    @Autowired
    private PaymentService paymentService;
    
    @GetMapping("/ping")
    public ApiResponse<String> ping() {
        return ApiResponse.success("pong");
    }
    
    @PostMapping("/echo")
    public ApiResponse<Map<String, Object>> echo(@RequestBody Map<String, Object> requestBody) {
        log.info("接收到测试请求: {}", requestBody);
        return ApiResponse.success(requestBody);
    }
    
    /**
     * 测试支付宝支付
     */
    @PostMapping("/alipay")
    public ApiResponse<PaymentResponse> testAlipayPayment(@RequestBody Map<String, Object> requestMap) {
        log.info("测试支付宝支付请求参数: {}", requestMap);
        
        // 手动创建PaymentRequest对象
        PaymentRequest request = new PaymentRequest();
        
        // 设置金额
        if (requestMap.containsKey("amount")) {
            Object amountObj = requestMap.get("amount");
            if (amountObj instanceof String) {
                request.setAmountStr((String) amountObj);
            } else if (amountObj instanceof Number) {
                request.setAmountStr(amountObj.toString());
            }
        } else {
            // 默认测试金额
            request.setAmount(new BigDecimal("0.01"));
        }
        
        // 设置会员类型
        if (requestMap.containsKey("membershipType")) {
            request.setMembershipType(requestMap.get("membershipType").toString());
        } else {
            // 默认会员类型
            request.setMembershipType("MONTHLY");
        }
        
        // 设置描述
        if (requestMap.containsKey("description")) {
            request.setDescription(requestMap.get("description").toString());
        } else {
            // 默认描述
            request.setDescription("测试支付 - 医护培训平台会员订阅");
        }
        
        // 设置用户ID
        if (requestMap.containsKey("userId")) {
            Object userIdObj = requestMap.get("userId");
            if (userIdObj instanceof Number) {
                request.setUserId(((Number) userIdObj).longValue());
            } else if (userIdObj instanceof String) {
                try {
                    request.setUserId(Long.parseLong((String) userIdObj));
                } catch (NumberFormatException e) {
                    log.warn("无法解析用户ID: {}", userIdObj);
                }
            }
        } else {
            // 默认用户ID (系统管理员)
            request.setUserId(1L);
        }
        
        // 设置支付方式为支付宝
        request.setPaymentType(Payment.PaymentType.ALIPAY);
        
        log.info("测试支付参数: {}", request);
        
        try {
            // 直接调用支付服务，绕过控制器
            PaymentResponse response = paymentService.createAlipayPayment(request);
            return ApiResponse.success(response);
        } catch (Exception e) {
            log.error("测试支付宝支付失败: {}", e.getMessage(), e);
            return ApiResponse.badRequest("测试支付宝支付失败: " + e.getMessage());
        }
    }
} 