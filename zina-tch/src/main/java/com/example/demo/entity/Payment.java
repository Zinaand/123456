package com.example.demo.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 外部支付单号
    private String outTradeNo;
    
    // 用户ID
    private Long userId;
    
    // 支付金额
    private BigDecimal amount;
    
    // 支付类型: WECHAT, ALIPAY, CARD
    @Enumerated(EnumType.STRING)
    private PaymentType paymentType;
    
    // 支付状态: PENDING, PROCESSING, SUCCESS, FAILED, CLOSED
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    // 支付会员类型: YEARLY, QUARTERLY, MONTHLY
    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;
    
    // 支付描述
    private String description;
    
    // 支付完成时间
    private LocalDateTime paidTime;
    
    // 创建时间
    private LocalDateTime createdTime;
    
    // 更新时间
    private LocalDateTime updatedTime;
    
    // 会员到期时间
    private LocalDateTime expireTime;
    
    // 支付二维码URL
    private String qrCodeUrl;
    
    // 支付回调数据
    @Column(columnDefinition = "TEXT")
    private String callbackData;
    
    @PrePersist
    public void prePersist() {
        this.createdTime = LocalDateTime.now();
        this.updatedTime = LocalDateTime.now();
        if (this.status == null) {
            this.status = PaymentStatus.PENDING;
        }
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedTime = LocalDateTime.now();
    }
    
    public enum PaymentType {
        WECHAT, ALIPAY, CARD
    }
    
    public enum PaymentStatus {
        PENDING, PROCESSING, SUCCESS, FAILED, CLOSED
    }
    
    public enum MembershipType {
        YEARLY, QUARTERLY, MONTHLY
    }
} 