package com.example.demo.service.impl;

import com.example.demo.pojo.Users;
import com.example.demo.mapper.UsersMapper;
import com.example.demo.service.UsersService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class UsersServiceImpl extends ServiceImpl<UsersMapper, Users> implements UsersService {

}
