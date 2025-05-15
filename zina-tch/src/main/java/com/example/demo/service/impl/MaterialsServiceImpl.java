package com.example.demo.service.impl;

import com.example.demo.pojo.Materials;
import com.example.demo.mapper.MaterialsMapper;
import com.example.demo.service.MaterialsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 学习资料表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class MaterialsServiceImpl extends ServiceImpl<MaterialsMapper, Materials> implements MaterialsService {

}
