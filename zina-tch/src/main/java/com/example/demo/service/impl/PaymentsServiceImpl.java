package com.example.demo.service.impl;

import com.example.demo.pojo.Payments;
import com.example.demo.mapper.PaymentsMapper;
import com.example.demo.service.PaymentsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 支付记录表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class PaymentsServiceImpl extends ServiceImpl<PaymentsMapper, Payments> implements PaymentsService {

}
