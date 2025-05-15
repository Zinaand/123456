package com.example.demo.service.impl;

import com.alibaba.fastjson.JSON;
import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.request.AlipayTradePagePayRequest;
import com.alipay.api.request.AlipayTradeQueryRequest;
import com.alipay.api.response.AlipayTradePagePayResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.example.demo.config.PaymentConfig;
import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.entity.Payment;
import com.example.demo.entity.Payment.PaymentStatus;
import com.example.demo.entity.Payment.PaymentType;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.service.PaymentService;
import com.example.demo.service.UserService;
import com.github.wxpay.sdk.WXPay;
import com.github.wxpay.sdk.WXPayConfig;
import com.github.wxpay.sdk.WXPayConstants;
import com.github.wxpay.sdk.WXPayUtil;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    
    private final PaymentRepository paymentRepository;
    private final PaymentConfig paymentConfig;
    private final UserService userService;
    
    // 支付宝客户端
    private AlipayClient getAlipayClient() {
        // 创建配置对象
        com.alipay.api.AlipayConfig alipayConfig = new com.alipay.api.AlipayConfig();
        
        // 设置网关地址和应用参数
        alipayConfig.setServerUrl(paymentConfig.getAlipay().getGatewayUrl());
        alipayConfig.setAppId(paymentConfig.getAlipay().getAppId());
        alipayConfig.setPrivateKey(paymentConfig.getAlipay().getPrivateKey());
        alipayConfig.setFormat(paymentConfig.getAlipay().getFormat());
        alipayConfig.setCharset(paymentConfig.getAlipay().getCharset());
        alipayConfig.setAlipayPublicKey(paymentConfig.getAlipay().getAlipayPublicKey());
        alipayConfig.setSignType(paymentConfig.getAlipay().getSignType());
        
        // 设置超时时间 - 使用配置的值
        alipayConfig.setConnectTimeout(paymentConfig.getAlipay().getConnectTimeout());
        alipayConfig.setReadTimeout(paymentConfig.getAlipay().getReadTimeout());
        
        log.info("创建支付宝客户端，连接超时: {}ms, 读取超时: {}ms", 
                paymentConfig.getAlipay().getConnectTimeout(),
                paymentConfig.getAlipay().getReadTimeout());
        
        try {
            return new DefaultAlipayClient(alipayConfig);
        } catch (Exception e) {
            log.error("创建支付宝客户端失败", e);
            // 如果创建失败，使用老方式创建
            return new DefaultAlipayClient(
                    paymentConfig.getAlipay().getGatewayUrl(),
                    paymentConfig.getAlipay().getAppId(),
                    paymentConfig.getAlipay().getPrivateKey(),
                    paymentConfig.getAlipay().getFormat(),
                    paymentConfig.getAlipay().getCharset(),
                    paymentConfig.getAlipay().getAlipayPublicKey(),
                    paymentConfig.getAlipay().getSignType()
            );
        }
    }
    
    // 微信支付配置
    private class WXPayConfigImpl implements WXPayConfig {
        @Override
        public String getAppID() {
            return paymentConfig.getWechat().getAppId();
        }
        
        @Override
        public String getMchID() {
            return paymentConfig.getWechat().getMchId();
        }
        
        @Override
        public String getKey() {
            return paymentConfig.getWechat().getKey();
        }
        
        @SneakyThrows
        @Override
        public InputStream getCertStream() {
            if (paymentConfig.getWechat().getCertPath() != null) {
                return new FileInputStream(new File(paymentConfig.getWechat().getCertPath()));
            }
            return null;
        }
        
        @Override
        public int getHttpConnectTimeoutMs() {
            return 8000;
        }
        
        @Override
        public int getHttpReadTimeoutMs() {
            return 10000;
        }
    }
    @Override
    @Transactional  // 事务管理，确保数据一致性
    public PaymentResponse createAlipayPayment(PaymentRequest request) {
        // 生成外部订单号
        String outTradeNo = generateTradeNo();
        
        try {
            // 创建支付实体并保存到数据库
            Payment payment = new Payment();
            payment.setUserId(request.getUserId());              // 设置用户ID
            payment.setAmount(request.getAmount());              // 设置支付金额
            payment.setPaymentType(PaymentType.ALIPAY);          // 设置支付类型为支付宝
            payment.setMembershipType(request.getMembershipTypeEnum()); // 设置会员类型
            payment.setDescription(request.getDescription());     // 设置描述
            payment.setOutTradeNo(outTradeNo);                   // 设置外部订单号
            payment.setStatus(PaymentStatus.PENDING);            // 设置状态为待支付
            payment.setExpireTime(LocalDateTime.now().plusMinutes(30)); // 30分钟有效期
            
            // 保存支付记录到数据库
            payment = paymentRepository.save(payment);
            
            // 获取支付宝二维码内容
            String qrCodeContent;
            String qrCodeUrl;
            
            try {
                // 构建支付宝请求参数 - 使用当面付接口
                AlipayClient alipayClient = getAlipayClient();  // 获取支付宝客户端
                
                // 创建当面付请求对象
                com.alipay.api.request.AlipayTradePrecreateRequest alipayRequest = new com.alipay.api.request.AlipayTradePrecreateRequest();
                // 设置异步通知地址 - 支付成功后支付宝会通知这个地址
                alipayRequest.setNotifyUrl(paymentConfig.getCallbackHost() + "/api/payments/alipay/notify");
                
                // 构建业务参数
                Map<String, String> bizParams = new HashMap<>();
                bizParams.put("out_trade_no", outTradeNo);                    // 商户订单号
                bizParams.put("total_amount", request.getAmount().toString());// 订单总金额
                bizParams.put("subject", "医护培训平台会员订阅");              // 订单标题
                bizParams.put("body", request.getDescription());              // 订单描述
                bizParams.put("timeout_express", "30m");                      // 订单超时时间
                
                // 将业务参数转为JSON字符串
                alipayRequest.setBizContent(JSON.toJSONString(bizParams));
                
                // 调用支付宝当面付API（带重试机制）
                log.info("调用支付宝当面付API生成二维码，参数：{}", alipayRequest.getBizContent());
                // 执行API调用并支持失败重试
                com.alipay.api.response.AlipayTradePrecreateResponse response = executeWithRetry(() -> {
                    try {
                        return alipayClient.execute(alipayRequest);
                    } catch (AlipayApiException e) {
                        log.warn("支付宝API调用失败，准备重试: {}", e.getMessage());
                        throw e;
                    }
                }, 3, 2000); // 最多重试3次，每次间隔2秒
                
                // 检查响应是否成功
                if (!response.isSuccess()) {
                    log.error("创建支付宝订单失败：{}", response.getMsg());
                    // 失败后使用降级方案
                    throw new Exception("支付宝返回失败: " + response.getMsg());
                }
                
                // 获取支付宝返回的二维码内容
                qrCodeContent = response.getQrCode();
                log.info("支付宝返回的二维码内容：{}", qrCodeContent);
            } catch (Exception e) {
                // 使用降级方案 - 创建模拟的二维码内容
                log.warn("支付宝API调用失败，使用本地模拟二维码: {}", e.getMessage());
                
                // 创建模拟的支付宝支付链接 (仅用于开发测试)
                qrCodeContent = "https://sandbox.alipay.com/simulate-pay?out_trade_no=" + outTradeNo 
                    + "&total_amount=" + request.getAmount().toString() 
                    + "&subject=医护培训平台会员订阅";
            }
            
            // 生成二维码图片并转为Base64格式
            qrCodeUrl = generateQrCode(qrCodeContent);
            
            // 更新支付记录
            payment.setQrCodeUrl(qrCodeUrl);            // 保存二维码URL
            payment.setStatus(PaymentStatus.PROCESSING); // 更新状态为处理中
            paymentRepository.save(payment);             // 保存更新
            
            // 返回支付响应
            return PaymentResponse.builder()
                    .paymentId(payment.getId())         // 支付记录ID
                    .outTradeNo(outTradeNo)             // 外部订单号
                    .amount(request.getAmount())        // 支付金额
                    .status(PaymentStatus.PROCESSING)   // 支付状态
                    .qrCodeUrl(qrCodeUrl)               // 二维码URL
                    .payUrl(qrCodeContent)              // 支付链接
                    .createdTime(payment.getCreatedTime()) // 创建时间
                    .expireTime(payment.getExpireTime())   // 过期时间
                    .build();
            
        } catch (Exception e) {
            log.error("创建支付宝支付订单异常", e);
            throw new RuntimeException("创建支付宝支付订单失败", e);
        }
    }
    
    /**
     * 带重试机制的方法执行
     * @param supplier 要执行的方法
     * @param maxRetries 最大重试次数
     * @param delayMillis 重试间隔（毫秒）
     * @return 执行结果
     * @throws Exception 执行过程中的异常
     */
    private <T> T executeWithRetry(RetryableSupplier<T> supplier, int maxRetries, long delayMillis) throws Exception {
        int retryCount = 0;
        Exception lastException = null;
        
        while (retryCount <= maxRetries) {
            try {
                if (retryCount > 0) {
                    log.info("第{}次重试调用API...", retryCount);
                }
                return supplier.get();
            } catch (AlipayApiException e) {
                lastException = e;
                log.warn("API调用失败，重试次数: {}/{}, 错误: {}", retryCount, maxRetries, e.getMessage());
                
                if (retryCount >= maxRetries) {
                    break;
                }
                
                // 等待一段时间后重试
                try {
                    Thread.sleep(delayMillis);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    throw e;
                }
                
                retryCount++;
            }
        }
        
        // 所有重试都失败了，抛出最后一个异常
        throw lastException;
    }
    
    /**
     * 可重试操作的函数式接口
     */
    @FunctionalInterface
    private interface RetryableSupplier<T> {
        T get() throws Exception;
    }
    
    @Override
    @Transactional
    public PaymentResponse createWechatPayment(PaymentRequest request) {
        try {
            // 生成外部订单号
            String outTradeNo = generateTradeNo();
            
            // 创建支付实体并保存
            Payment payment = new Payment();
            payment.setUserId(request.getUserId());
            payment.setAmount(request.getAmount());
            payment.setPaymentType(PaymentType.WECHAT);
            payment.setMembershipType(request.getMembershipTypeEnum());
            payment.setDescription(request.getDescription());
            payment.setOutTradeNo(outTradeNo);
            payment.setStatus(PaymentStatus.PENDING);
            payment.setExpireTime(LocalDateTime.now().plusMinutes(30)); // 30分钟有效期
            
            // 保存支付记录
            payment = paymentRepository.save(payment);
            
            // 初始化微信支付
            WXPay wxPay = new WXPay(new WXPayConfigImpl(), WXPayConstants.SignType.MD5);
            
            // 构建微信支付请求参数
            Map<String, String> data = new HashMap<>();
            data.put("body", "医护培训平台会员订阅");
            data.put("out_trade_no", outTradeNo);
            data.put("total_fee", request.getAmount().multiply(new BigDecimal("100")).intValue() + ""); // 转换为分
            data.put("spbill_create_ip", "127.0.0.1"); // 服务器IP
            data.put("notify_url", paymentConfig.getCallbackHost() + "/api/payments/wechat/notify");
            data.put("trade_type", "NATIVE"); // 网页扫码支付
            
            // 调用微信支付API
            Map<String, String> resp = wxPay.unifiedOrder(data);
            
            if (!"SUCCESS".equals(resp.get("return_code")) || !"SUCCESS".equals(resp.get("result_code"))) {
                throw new RuntimeException("创建微信支付订单失败：" + resp.get("return_msg"));
            }
            
            // 获取二维码链接
            String codeUrl = resp.get("code_url");
            
            // 生成二维码
            String qrCodeUrl = generateQrCode(codeUrl);
            
            // 更新支付记录
            payment.setQrCodeUrl(qrCodeUrl);
            payment.setStatus(PaymentStatus.PROCESSING);
            paymentRepository.save(payment);
            
            // 返回支付响应
            return PaymentResponse.builder()
                    .paymentId(payment.getId())
                    .outTradeNo(outTradeNo)
                    .amount(request.getAmount())
                    .status(PaymentStatus.PROCESSING)
                    .qrCodeUrl(qrCodeUrl)
                    .createdTime(payment.getCreatedTime())
                    .expireTime(payment.getExpireTime())
                    .build();
            
        } catch (Exception e) {
            log.error("创建微信支付订单异常", e);
            throw new RuntimeException("创建微信支付订单失败", e);
        }
    }
    
    @Override
    @Transactional
    public String handleAlipayCallback(Map<String, String> params) {
        try {
            // 记录回调参数
            log.info("收到支付宝回调参数: {}", params);
            
            // 验证签名
            boolean signVerified = verifyAlipaySign(params);
            if (!signVerified) {
                log.error("支付宝回调签名验证失败");
                return "failure";
            }
            
            // 获取支付订单号
            String outTradeNo = params.get("out_trade_no");
            
            // 查询订单
            Optional<Payment> paymentOpt = paymentRepository.findByOutTradeNo(outTradeNo);
            if (!paymentOpt.isPresent()) {
                log.error("支付订单不存在：{}", outTradeNo);
                return "failure";
            }
            
            Payment payment = paymentOpt.get();
            
            // 判断支付状态
            String tradeStatus = params.get("trade_status");
            log.info("支付宝回调状态: {}, 订单号: {}", tradeStatus, outTradeNo);
            
            if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                // 支付成功
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setPaidTime(LocalDateTime.now());
                payment.setCallbackData(params.toString());
                paymentRepository.save(payment);
                
                // 更新用户会员信息
                updateUserMembership(payment);
                
                log.info("支付宝支付成功，订单号: {}, 用户ID: {}", outTradeNo, payment.getUserId());
                return "success";
            } else {
                // 其他状态
                payment.setStatus(PaymentStatus.FAILED);
                payment.setCallbackData(params.toString());
                paymentRepository.save(payment);
                
                log.warn("支付宝支付失败，状态: {}, 订单号: {}", tradeStatus, outTradeNo);
                return "failure";
            }
            
        } catch (Exception e) {
            log.error("处理支付宝回调异常", e);
            return "failure";
        }
    }
    
    @Override
    @Transactional
    public String handleWechatCallback(HttpServletRequest request) {
        try {
            // 读取回调数据
            String xmlData = readXmlFromRequest(request);
            Map<String, String> params = WXPayUtil.xmlToMap(xmlData);
            
            // 验证签名
            boolean signVerified = WXPayUtil.isSignatureValid(params, paymentConfig.getWechat().getKey());
            if (!signVerified) {
                log.error("微信支付回调签名验证失败");
                return wechatCallbackResponse("FAIL", "签名验证失败");
            }
            
            // 获取支付订单号
            String outTradeNo = params.get("out_trade_no");
            
            // 查询订单
            Optional<Payment> paymentOpt = paymentRepository.findByOutTradeNo(outTradeNo);
            if (!paymentOpt.isPresent()) {
                log.error("支付订单不存在：{}", outTradeNo);
                return wechatCallbackResponse("FAIL", "订单不存在");
            }
            
            Payment payment = paymentOpt.get();
            
            // 判断支付状态
            String returnCode = params.get("return_code");
            String resultCode = params.get("result_code");
            if ("SUCCESS".equals(returnCode) && "SUCCESS".equals(resultCode)) {
                // 支付成功
                payment.setStatus(PaymentStatus.SUCCESS);
                payment.setPaidTime(LocalDateTime.now());
                payment.setCallbackData(xmlData);
                paymentRepository.save(payment);
                
                // 更新用户会员信息
                updateUserMembership(payment);
                
                return wechatCallbackResponse("SUCCESS", "OK");
            } else {
                // 其他状态
                payment.setStatus(PaymentStatus.FAILED);
                payment.setCallbackData(xmlData);
                paymentRepository.save(payment);
                
                return wechatCallbackResponse("FAIL", "支付失败");
            }
            
        } catch (Exception e) {
            log.error("处理微信支付回调异常", e);
            return wechatCallbackResponse("FAIL", "服务器异常");
        }
    }
    
    @Override
    public PaymentResponse queryPaymentStatus(Long paymentId) {
        // 查询支付订单
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("支付订单不存在"));
        
        // 如果支付订单已经完成，直接返回
        if (payment.getStatus() == PaymentStatus.SUCCESS || 
            payment.getStatus() == PaymentStatus.FAILED || 
            payment.getStatus() == PaymentStatus.CLOSED) {
            return buildPaymentResponse(payment);
        }
        
        // 如果支付订单已经超时，更新状态
        if (payment.getExpireTime().isBefore(LocalDateTime.now())) {
            payment.setStatus(PaymentStatus.CLOSED);
            paymentRepository.save(payment);
            return buildPaymentResponse(payment);
        }
        
        // 根据支付方式查询实际支付状态
        try {
            if (payment.getPaymentType() == PaymentType.ALIPAY) {
                // 查询支付宝订单状态
                AlipayClient alipayClient = getAlipayClient();
                AlipayTradeQueryRequest request = new AlipayTradeQueryRequest();
                
                Map<String, String> bizParams = new HashMap<>();
                bizParams.put("out_trade_no", payment.getOutTradeNo());
                
                request.setBizContent(JSON.toJSONString(bizParams));
                AlipayTradeQueryResponse response = alipayClient.execute(request);
                
                if (response.isSuccess()) {
                    String tradeStatus = response.getTradeStatus();
                    if ("TRADE_SUCCESS".equals(tradeStatus) || "TRADE_FINISHED".equals(tradeStatus)) {
                        // 支付成功
                        payment.setStatus(PaymentStatus.SUCCESS);
                        payment.setPaidTime(LocalDateTime.now());
                        paymentRepository.save(payment);
                        
                        // 更新用户会员信息
                        updateUserMembership(payment);
                    } else if ("TRADE_CLOSED".equals(tradeStatus)) {
                        // 支付关闭
                        payment.setStatus(PaymentStatus.CLOSED);
                        paymentRepository.save(payment);
                    }
                }
            } else if (payment.getPaymentType() == PaymentType.WECHAT) {
                // 查询微信支付订单状态
                WXPay wxPay = new WXPay(new WXPayConfigImpl());
                
                Map<String, String> data = new HashMap<>();
                data.put("out_trade_no", payment.getOutTradeNo());
                
                Map<String, String> resp = wxPay.orderQuery(data);
                
                if ("SUCCESS".equals(resp.get("return_code")) && "SUCCESS".equals(resp.get("result_code"))) {
                    String tradeState = resp.get("trade_state");
                    if ("SUCCESS".equals(tradeState)) {
                        // 支付成功
                        payment.setStatus(PaymentStatus.SUCCESS);
                        payment.setPaidTime(LocalDateTime.now());
                        paymentRepository.save(payment);
                        
                        // 更新用户会员信息
                        updateUserMembership(payment);
                    } else if ("CLOSED".equals(tradeState) || "REVOKED".equals(tradeState)) {
                        // 支付关闭
                        payment.setStatus(PaymentStatus.CLOSED);
                        paymentRepository.save(payment);
                    }
                }
            }
        } catch (Exception e) {
            log.error("查询支付状态异常", e);
            // 查询异常，不影响返回
        }
        
        return buildPaymentResponse(payment);
    }
    
    @Override
    @Transactional
    public boolean cancelPayment(Long paymentId) {
        // 查询支付订单
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("支付订单不存在"));
        
        // 只有待支付和处理中的订单可以取消
        if (payment.getStatus() != PaymentStatus.PENDING && payment.getStatus() != PaymentStatus.PROCESSING) {
            throw new RuntimeException("当前订单状态不可取消");
        }
        
        try {
            // 根据支付方式取消订单
            if (payment.getPaymentType() == PaymentType.ALIPAY) {
                // 支付宝取消订单逻辑（简化处理，直接修改状态）
                // 实际项目中，应该调用支付宝的交易关闭接口
            } else if (payment.getPaymentType() == PaymentType.WECHAT) {
                // 微信支付取消订单逻辑（简化处理，直接修改状态）
                // 实际项目中，应该调用微信支付的关闭订单接口
            }
            
            // 更新支付订单状态
            payment.setStatus(PaymentStatus.CLOSED);
            paymentRepository.save(payment);
            
            return true;
        } catch (Exception e) {
            log.error("取消支付订单异常", e);
            throw new RuntimeException("取消支付订单失败", e);
        }
    }
    
    @Override
    public String generateQrCode(String content) {
        try {
            // 定义二维码参数
            int width = 300;
            int height = 300;
            
            // 生成二维码矩阵
            BitMatrix bitMatrix = new MultiFormatWriter().encode(
                    content, BarcodeFormat.QR_CODE, width, height);
            
            // 将二维码矩阵转为图片
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            // 将图片转为Base64编码
            byte[] imageBytes = outputStream.toByteArray();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
            return "data:image/png;base64," + base64Image;
        } catch (WriterException | java.io.IOException e) {
            log.error("生成二维码异常", e);
            throw new RuntimeException("生成二维码失败", e);
        }
    }
    
    @Override
    @Transactional
    public void updateUserMembership(Payment payment) {
        // 根据会员类型设置会员有效期
        LocalDateTime expireTime;
        switch (payment.getMembershipType()) {
            case YEARLY:
                expireTime = LocalDateTime.now().plusYears(1);
                break;
            case QUARTERLY:
                expireTime = LocalDateTime.now().plusMonths(3);
                break;
            case MONTHLY:
                expireTime = LocalDateTime.now().plusMonths(1);
                break;
            default:
                throw new IllegalArgumentException("无效的会员类型");
        }
        
        // 更新用户会员信息
        userService.updateMembership(payment.getUserId(), payment.getMembershipType().name(), expireTime);
        
        // 设置支付订单的过期时间
        payment.setExpireTime(expireTime);
        paymentRepository.save(payment);
    }
    
    // --- 辅助方法 ---
    
    // 生成交易单号
    private String generateTradeNo() {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return timestamp + uuid;
    }
    
    // 验证支付宝签名
    private boolean verifyAlipaySign(Map<String, String> params) {
        try {
            // 1. 移除sign和sign_type参数
            String sign = params.get("sign");
            String signType = params.get("sign_type");
            if (sign == null || signType == null) {
                log.error("支付宝回调缺少sign或sign_type参数");
                return false;
            }
            
            // 2. 获取支付宝公钥
            String alipayPublicKey = paymentConfig.getAlipay().getAlipayPublicKey();
            
            // 3. 组装验签参数
            Map<String, String> signParams = new HashMap<>(params);
            signParams.remove("sign");
            signParams.remove("sign_type");
            
            // 4. 使用SDK方法进行验签
            String content = getSignContent(signParams);
            return com.alipay.api.internal.util.AlipaySignature.rsaCheck(
                content, sign, alipayPublicKey, paymentConfig.getAlipay().getCharset(), signType);
        } catch (Exception e) {
            log.error("验证支付宝签名异常", e);
            return false;
        }
    }
    
    // 组装待签名内容
    private String getSignContent(Map<String, String> params) {
        // 1. 按照字母顺序排序参数
        List<String> keys = new ArrayList<>(params.keySet());
        Collections.sort(keys);
        
        // 2. 组装待签名内容
        StringBuilder content = new StringBuilder();
        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            String value = params.get(key);
            if (value != null && value.length() > 0) {
                if (i > 0) {
                    content.append("&");
                }
                content.append(key).append("=").append(value);
            }
        }
        
        return content.toString();
    }
    
    // 读取微信支付回调XML数据
    private String readXmlFromRequest(HttpServletRequest request) {
        // 实际项目中，应该从request中读取XML数据
        // 此处简化实现，仅供示例
        return "";
    }
    
    // 构建微信支付回调响应
    private String wechatCallbackResponse(String returnCode, String returnMsg) {
        try {
            Map<String, String> data = new HashMap<>();
            data.put("return_code", returnCode);
            data.put("return_msg", returnMsg);
            return WXPayUtil.mapToXml(data);
        } catch (Exception e) {
            log.error("构建微信支付回调响应异常", e);
            return "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[服务器异常]]></return_msg></xml>";
        }
    }
    
    // 构建支付响应
    private PaymentResponse buildPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .outTradeNo(payment.getOutTradeNo())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .qrCodeUrl(payment.getQrCodeUrl())
                .createdTime(payment.getCreatedTime())
                .expireTime(payment.getExpireTime())
                .build();
    }
    
    @Override
    @Transactional
    public boolean mockPaymentSuccess(Long paymentId) {
        try {
            // 查询支付订单
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("支付订单不存在"));
            
            // 只有pending和processing状态的订单可以模拟支付成功
            if (payment.getStatus() != PaymentStatus.PENDING && payment.getStatus() != PaymentStatus.PROCESSING) {
                log.warn("订单状态不允许模拟支付成功，当前状态: {}", payment.getStatus());
                return false;
            }
            
            // 更新支付状态为成功
            payment.setStatus(PaymentStatus.SUCCESS);
            payment.setPaidTime(LocalDateTime.now());
            payment.setCallbackData("模拟支付成功");
            paymentRepository.save(payment);
            
            // 更新用户会员信息
            updateUserMembership(payment);
            
            log.info("模拟支付成功，订单ID: {}, 交易号: {}", payment.getId(), payment.getOutTradeNo());
            return true;
        } catch (Exception e) {
            log.error("模拟支付成功失败", e);
            return false;
        }
    }
} 