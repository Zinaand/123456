'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ApiResponse, PaginatedResponse, Video } from "@/types";
import { videoApi } from "@/lib/api";
import { formatDuration } from "@/lib/utils";
import { getCategoryNameById } from "@/lib/category-utils";
import { Loader2, ImageOff } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState<{[key: number]: boolean}>({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await videoApi.getVideos({
          page: 1,
          size: 12,
          status: "published"
        });

        const apiResponse = response.data as ApiResponse<PaginatedResponse<Video>>;
        if (apiResponse.code === 200 && apiResponse.data.records) {
          setCourses(apiResponse.data.records);
        } else {
          setError("获取课程数据失败");
        }
      } catch (error) {
        console.error("获取课程列表失败:", error);
        setError("获取课程列表失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 处理图片加载错误
  const handleImageError = (courseId: number) => {
    setImgError(prev => ({...prev, [courseId]: true}));
  };

  // 加载状态
  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">专业医护课程</h1>
          <p className="text-muted-foreground">浏览我们精心设计的医护专业培训课程</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-muted animate-pulse" />
              <CardHeader className="p-4">
                <div className="h-6 bg-muted animate-pulse rounded-md mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded-md" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="h-8 bg-muted animate-pulse rounded-md" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">专业医护课程</h1>
          <p className="text-muted-foreground">浏览我们精心设计的医护专业培训课程</p>
        </div>
        <div className="p-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>重新加载</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">专业医护课程</h1>
        <p className="text-muted-foreground">浏览我们精心设计的医护专业培训课程</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="aspect-video relative bg-muted">
              {course.thumbnailUrl && !imgError[course.id] ? (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(course.id)}
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                  <ImageOff className="w-12 h-12 text-slate-400" />
                  <span className="sr-only">暂无缩略图</span>
                </div>
              )}
              {course.accessType === "internal" && (
                <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                  会员专享
                </div>
              )}
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex gap-2 mb-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {getCategoryNameById(course.categoryId)}
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {course.views}次观看
                </span>
              </div>
              <div className="text-sm text-muted-foreground">时长：{formatDuration(course.duration)}</div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Link href={`/courses/${course.id}`}>
                <Button variant="secondary" size="sm">查看详情</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无课程</p>
        </div>
      )}
    </div>
  );
} 