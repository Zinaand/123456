package com.example.demo.repository;

import com.example.demo.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // 根据外部交易号查询
    Optional<Payment> findByOutTradeNo(String outTradeNo);
    
    // 根据用户ID查询所有支付记录
    List<Payment> findByUserIdOrderByCreatedTimeDesc(Long userId);
    
    // 根据用户ID和支付状态查询
    List<Payment> findByUserIdAndStatus(Long userId, Payment.PaymentStatus status);
    
    // 根据支付类型和状态查询
    List<Payment> findByPaymentTypeAndStatus(Payment.PaymentType paymentType, Payment.PaymentStatus status);
} 