package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.pojo.VideoCategories;
import com.example.demo.service.VideoCategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 视频分类表 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VideoCategoriesController {

    private final VideoCategoriesService videoCategoriesService;

    /**
     * 获取所有分类
     */
    @GetMapping
    public ApiResponse<List<VideoCategories>> getAllCategories() {
        List<VideoCategories> categories = videoCategoriesService.list();
        return ApiResponse.success(categories);
    }

    /**
     * 根据ID获取分类
     */
    @GetMapping("/{id}")
    public ApiResponse<VideoCategories> getCategoryById(@PathVariable Integer id) {
        VideoCategories category = videoCategoriesService.getById(id);
        if (category == null) {
            return ApiResponse.notFound("分类不存在");
        }
        return ApiResponse.success(category);
    }
}
