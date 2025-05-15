package com.example.demo.service.impl;

import com.example.demo.pojo.Comments;
import com.example.demo.mapper.CommentsMapper;
import com.example.demo.service.CommentsService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 评论表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class CommentsServiceImpl extends ServiceImpl<CommentsMapper, Comments> implements CommentsService {

}
