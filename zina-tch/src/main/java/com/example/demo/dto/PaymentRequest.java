package com.example.demo.dto;

import com.example.demo.entity.Payment.MembershipType;
import com.example.demo.entity.Payment.PaymentType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;

@Data
@Slf4j
public class PaymentRequest {
    
    // 支付金额
    @NotNull(message = "支付金额不能为空")
    @Positive(message = "支付金额必须大于0")
    private BigDecimal amount;
    
    // 会员类型 - 接收字符串格式
    @NotNull(message = "会员类型不能为空")
    private String membershipType;
    
    // 支付方式 - 由控制器根据接口自动设置
    @JsonIgnore
    private PaymentType paymentType;
    
    // 描述信息
    private String description;
    
    // 用户ID (可选，如果已登录则从Token中获取)
    private Long userId;
    
    /**
     * 支持字符串格式的金额设置
     * 这个方法会被Jackson调用如果JSON中的amount是字符串
     */
    @JsonProperty("amount")
    public void setAmountStr(String amount) {
        try {
            log.info("接收到字符串格式的金额: {}", amount);
            this.amount = new BigDecimal(amount);
        } catch (Exception e) {
            log.error("转换金额字符串失败: {}", amount, e);
            throw new IllegalArgumentException("金额格式不正确: " + amount);
        }
    }
    
    // 获取枚举类型的会员类型
    @JsonIgnore
    public MembershipType getMembershipTypeEnum() {
        if (membershipType == null) {
            log.warn("会员类型为空");
            return null;
        }
        
        log.info("转换会员类型, 原始值: {}", membershipType);
        String upperCaseType = membershipType.toUpperCase();
        log.info("转换后的会员类型值: {}", upperCaseType);
        
        switch (upperCaseType) {
            case "YEARLY":
            case "YEAR":
            case "ANNUAL":
                return MembershipType.YEARLY;
            case "QUARTERLY":
            case "QUARTER":
                return MembershipType.QUARTERLY;
            case "MONTHLY":
            case "MONTH":
                return MembershipType.MONTHLY;
            default:
                log.error("无效的会员类型: {}", membershipType);
                throw new IllegalArgumentException("无效的会员类型: " + membershipType);
        }
    }
} 