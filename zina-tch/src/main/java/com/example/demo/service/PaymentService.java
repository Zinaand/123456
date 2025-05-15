package com.example.demo.service;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.entity.Payment;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

public interface PaymentService {
    
    /**
     * 创建支付宝支付订单
     * @param request 支付请求
     * @return 支付响应
     */
    PaymentResponse createAlipayPayment(PaymentRequest request);
    
    /**
     * 创建微信支付订单
     * @param request 支付请求
     * @return 支付响应
     */
    PaymentResponse createWechatPayment(PaymentRequest request);
    
    /**
     * 处理支付宝支付回调
     * @param params 回调参数
     * @return 处理结果
     */
    String handleAlipayCallback(Map<String, String> params);
    
    /**
     * 处理微信支付回调
     * @param request HTTP请求
     * @return 处理结果
     */
    String handleWechatCallback(HttpServletRequest request);
    
    /**
     * 查询支付订单状态
     * @param paymentId 支付ID
     * @return 支付响应
     */
    PaymentResponse queryPaymentStatus(Long paymentId);
    
    /**
     * 取消支付订单
     * @param paymentId 支付ID
     * @return 取消结果
     */
    boolean cancelPayment(Long paymentId);
    
    /**
     * 生成支付二维码
     * @param content 二维码内容
     * @return 二维码图片Base64编码
     */
    String generateQrCode(String content);
    
    /**
     * 更新用户会员信息
     * @param payment 支付订单
     */
    void updateUserMembership(Payment payment);
    
    /**
     * 模拟支付成功（仅用于开发和测试环境）
     * @param paymentId 支付ID
     * @return 是否成功
     */
    boolean mockPaymentSuccess(Long paymentId);
} 