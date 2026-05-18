package com.example.demo.controller;

import com.example.demo.common.ApiResponse;
import com.example.demo.pojo.Instructors;
import com.example.demo.service.InstructorsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>
 * 讲师表 前端控制器
 * </p>
 *
 * @author Zina
 * @since 2025-05-08
 */
@RestController
@RequestMapping("/api/instructors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InstructorsController {

    private final InstructorsService instructorsService;

    /**
     * 获取所有讲师
     */
    @GetMapping
    public ApiResponse<List<Instructors>> getAllInstructors() {
        List<Instructors> instructors = instructorsService.list();
        return ApiResponse.success(instructors);
    }

    /**
     * 根据ID获取讲师
     */
    @GetMapping("/{id}")
    public ApiResponse<Instructors> getInstructorById(@PathVariable Integer id) {
        Instructors instructor = instructorsService.getById(id);
        if (instructor == null) {
            return ApiResponse.notFound("讲师不存在");
        }
        return ApiResponse.success(instructor);
    }
}
