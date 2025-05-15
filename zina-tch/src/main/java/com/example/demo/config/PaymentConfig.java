package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "payment")
public class PaymentConfig {
    
    // 微信支付配置
    private WechatPayConfig wechat = new WechatPayConfig();
    
    // 支付宝支付配置
    private AlipayConfig alipay = new AlipayConfig();
    
    // 支付回调配置
    private String callbackHost;
    
    @Data
    public static class WechatPayConfig {
        // 应用ID
        private String appId;
        // 商户号
        private String mchId;
        // 商户API密钥
        private String key;
        // 回调地址
        private String notifyUrl;
        // 证书路径
        private String certPath;
    }
    
    @Data
    public static class AlipayConfig {
        // 应用ID
        private String appId;
        // 商户私钥
        private String privateKey;
        // 支付宝公钥
        private String alipayPublicKey;
        // 回调地址
        private String notifyUrl;
        // 支付宝网关地址，沙箱环境：https://openapi.alipaydev.com/gateway.do
        private String gatewayUrl = "https://openapi.alipaydev.com/gateway.do";
        // 编码
        private String charset = "UTF-8";
        // 返回格式
        private String format = "json";
        // 签名方式
        private String signType = "RSA2";
        // 连接超时时间，单位毫秒
        private int connectTimeout = 60000;
        // 读取超时时间，单位毫秒
        private int readTimeout = 60000;
    }
} 