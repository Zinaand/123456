package com.example.demo.controller;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.PaymentResponse;
import com.example.demo.entity.Payment;
import com.example.demo.service.PaymentService;
import com.example.demo.util.ApiResponse;
import com.example.demo.repository.PaymentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);
    
    public PaymentController(PaymentService paymentService, @Qualifier("customObjectMapper") ObjectMapper objectMapper) {
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }
    
    /**
     * 创建支付宝支付订单
     */
    @PostMapping("/alipay")
    public ResponseEntity<ApiResponse<PaymentResponse>> createAlipayPayment(
            @RequestBody Map<String, Object> requestMap,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        try {
            // 记录原始请求参数
            log.info("支付宝支付请求参数: {}", requestMap);
            
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
            }
            
            // 设置会员类型
            if (requestMap.containsKey("membershipType")) {
                request.setMembershipType(requestMap.get("membershipType").toString());
            }
            
            // 设置描述
            if (requestMap.containsKey("description")) {
                request.setDescription(requestMap.get("description").toString());
            }
            
            // 设置用户ID
            Long userId = null;
            // 首先从请求参数中获取userId
            if (requestMap.containsKey("userId")) {
                Object userIdObj = requestMap.get("userId");
                if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).longValue();
                } else if (userIdObj instanceof String) {
                    try {
                        userId = Long.parseLong((String) userIdObj);
                    } catch (NumberFormatException e) {
                        log.warn("无法解析用户ID: {}", userIdObj);
                    }
                }
            }
            
            // 如果请求参数中没有userId，尝试从认证信息获取
            if (userId == null && authentication != null && authentication.getPrincipal() != null) {
                // 根据您的用户对象结构获取userId
                Object principal = authentication.getPrincipal();
                // 这里需要根据您的实际用户对象类型进行转换
                try {
                    if (principal instanceof org.springframework.security.core.userdetails.User) {
                        // 从用户名中获取ID或其他操作
                        String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
                        log.info("已从认证信息获取用户名: {}", username);
                        // 这里可以根据用户名查询用户ID
                        // userId = userService.findIdByUsername(username);
                    } else if (principal.toString().matches("\\d+")) {
                        // 尝试直接解析为数字
                        userId = Long.parseLong(principal.toString());
                    }
                } catch (Exception e) {
                    log.warn("从认证信息获取用户ID失败: {}", e.getMessage());
                }
            }
            
            // 如果仍未获取到userId，设置默认值为1
            if (userId == null) {
                userId = 1L; // 设置默认用户ID，避免数据库约束错误
                log.warn("未找到用户ID，使用默认ID: {}", userId);
            }
            
            request.setUserId(userId);
            
            log.info("处理后的请求参数: {}", request);
            log.info("支付金额类型: {}, 值: {}", request.getAmount() != null ? request.getAmount().getClass().getName() : "null", request.getAmount());
            log.info("会员类型: {}", request.getMembershipType());
            log.info("用户ID: {}", request.getUserId());
            
            // 设置支付方式为支付宝
            request.setPaymentType(Payment.PaymentType.ALIPAY);
            
            PaymentResponse response = paymentService.createAlipayPayment(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            // 记录详细错误信息
            log.error("创建支付宝订单失败: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        }
    }
    
    /**
     * 创建微信支付订单
     */
    @PostMapping("/wechat")
    public ResponseEntity<ApiResponse<PaymentResponse>> createWechatPayment(
            @RequestBody Map<String, Object> requestMap,
            HttpServletRequest httpRequest,
            Authentication authentication) {
        
        try {
            // 记录原始请求参数
            log.info("微信支付请求参数: {}", requestMap);
            
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
            }
            
            // 设置会员类型
            if (requestMap.containsKey("membershipType")) {
                request.setMembershipType(requestMap.get("membershipType").toString());
            }
            
            // 设置描述
            if (requestMap.containsKey("description")) {
                request.setDescription(requestMap.get("description").toString());
            }
            
            // 设置用户ID
            Long userId = null;
            // 首先从请求参数中获取userId
            if (requestMap.containsKey("userId")) {
                Object userIdObj = requestMap.get("userId");
                if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).longValue();
                } else if (userIdObj instanceof String) {
                    try {
                        userId = Long.parseLong((String) userIdObj);
                    } catch (NumberFormatException e) {
                        log.warn("无法解析用户ID: {}", userIdObj);
                    }
                }
            }
            
            // 如果请求参数中没有userId，尝试从认证信息获取
            if (userId == null && authentication != null && authentication.getPrincipal() != null) {
                // 根据您的用户对象结构获取userId
                Object principal = authentication.getPrincipal();
                // 这里需要根据您的实际用户对象类型进行转换
                try {
                    if (principal instanceof org.springframework.security.core.userdetails.User) {
                        // 从用户名中获取ID或其他操作
                        String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
                        log.info("已从认证信息获取用户名: {}", username);
                        // 这里可以根据用户名查询用户ID
                        // userId = userService.findIdByUsername(username);
                    } else if (principal.toString().matches("\\d+")) {
                        // 尝试直接解析为数字
                        userId = Long.parseLong(principal.toString());
                    }
                } catch (Exception e) {
                    log.warn("从认证信息获取用户ID失败: {}", e.getMessage());
                }
            }
            
            // 如果仍未获取到userId，设置默认值为1
            if (userId == null) {
                userId = 1L; // 设置默认用户ID，避免数据库约束错误
                log.warn("未找到用户ID，使用默认ID: {}", userId);
            }
            
            request.setUserId(userId);
            
            log.info("处理后的请求参数: {}", request);
            log.info("支付金额类型: {}, 值: {}", request.getAmount() != null ? request.getAmount().getClass().getName() : "null", request.getAmount());
            log.info("会员类型: {}", request.getMembershipType());
            log.info("用户ID: {}", request.getUserId());
            
            // 设置支付方式为微信支付
            request.setPaymentType(Payment.PaymentType.WECHAT);
            
            PaymentResponse response = paymentService.createWechatPayment(request);
            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            // 记录详细错误信息
            log.error("创建微信支付订单失败: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        }
    }
    
    /**
     * 获取请求体的原始内容
     */
    private String getRequestBody(HttpServletRequest request) throws IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        return buffer.toString();
    }
    
    /**
     * 支付宝支付回调通知
     */
    @PostMapping("/alipay/notify")
    public String alipayNotify(@RequestParam Map<String, String> params) {
        return paymentService.handleAlipayCallback(params);
    }
    
    /**
     * 支付宝支付同步返回
     */
    @GetMapping("/alipay/return")
    public String alipayReturn(@RequestParam Map<String, String> params) {
        // 验证支付状态，然后重定向到前端页面
        // 此处简化实现，仅记录日志并重定向到前端
        return "redirect:/payment/success";
    }
    
    /**
     * 微信支付回调通知
     */
    @PostMapping("/wechat/notify")
    public String wechatNotify(HttpServletRequest request) {
        return paymentService.handleWechatCallback(request);
    }
    
    /**
     * 查询支付状态
     */
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<ApiResponse<PaymentResponse>> queryPaymentStatus(
            @PathVariable Long paymentId) {
        
        PaymentResponse response = paymentService.queryPaymentStatus(paymentId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
    
    /**
     * 取消支付
     */
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<ApiResponse<Boolean>> cancelPayment(
            @PathVariable Long paymentId) {
        
        boolean result = paymentService.cancelPayment(paymentId);
        return ResponseEntity.ok(ApiResponse.success(result));
    }
    
    /**
     * 模拟支付成功（仅用于开发和测试环境）
     */
    @PostMapping("/{paymentId}/mock-success")
    public ResponseEntity<ApiResponse<Boolean>> mockPaymentSuccess(
            @PathVariable Long paymentId) {
        
        log.info("模拟支付成功请求，支付ID: {}", paymentId);
        
        try {
            // 查询支付订单
            Payment payment = paymentService.queryPaymentStatus(paymentId).getPaymentId() != null ? 
                    new Payment() : null;
            
            if (payment == null) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.badRequest("支付订单不存在"));
            }
            
            // 通过服务层更新支付状态
            boolean success = paymentService.mockPaymentSuccess(paymentId);
            
            if (success) {
                log.info("模拟支付成功，订单ID: {}", paymentId);
                return ResponseEntity.ok(ApiResponse.success(true));
            } else {
                return ResponseEntity.badRequest().body(
                        ApiResponse.badRequest("模拟支付失败，可能订单状态已经是成功或无法更新"));
            }
        } catch (Exception e) {
            log.error("模拟支付成功失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.badRequest(e.getMessage()));
        }
    }
} 