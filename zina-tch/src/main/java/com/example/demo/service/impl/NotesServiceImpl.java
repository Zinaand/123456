package com.example.demo.service.impl;

import com.example.demo.pojo.Notes;
import com.example.demo.mapper.NotesMapper;
import com.example.demo.service.NotesService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 用户笔记表 服务实现类
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@Service
public class NotesServiceImpl extends ServiceImpl<NotesMapper, Notes> implements NotesService {

}
