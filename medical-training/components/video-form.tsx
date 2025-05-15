"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { videoApi } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

// 视频表单验证架构
const videoFormSchema = z.object({
  title: z.string().min(3, { message: "标题至少需要3个字符" }).max(100, { message: "标题最多100个字符" }),
  description: z.string().min(10, { message: "描述至少需要10个字符" }).max(1000, { message: "描述最多1000个字符" }),
  categoryId: z.string({ required_error: "请选择分类" }),
  instructorId: z.string({ required_error: "请选择讲师" }),
  accessType: z.enum(["external", "internal"], { required_error: "请选择访问类型" }),
  status: z.enum(["draft", "published", "archived"], { required_error: "请选择状态" }),
  duration: z.number().optional(),
  videoFile: z.any().optional(),
  thumbnailFile: z.any().optional(),
})

type VideoFormValues = z.infer<typeof videoFormSchema>

interface VideoFormProps {
  videoId?: number // 如果提供则为编辑模式，否则为新建模式
  onSuccess?: () => void
}

export function VideoForm({ videoId, onSuccess }: VideoFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])
  const [instructors, setInstructors] = useState<{id: number, name: string}[]>([])
  
  // 初始化表单
  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: "",
      instructorId: "",
      accessType: "external",
      status: "draft",
    },
  })

  // 获取视频分类
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 实际项目中这里应该调用API获取分类
        // const response = await videoApi.getCategories()
        // setCategories(response.data)
        
        // 模拟分类数据
        setCategories([
          { id: 1, name: "基础医学" },
          { id: 2, name: "临床护理" },
          { id: 3, name: "急救技能" },
          { id: 4, name: "医疗设备操作" },
          { id: 5, name: "病患沟通" },
        ])
      } catch (error) {
        console.error("获取视频分类失败", error)
        toast({
          variant: "destructive",
          title: "获取视频分类失败",
          description: "无法加载视频分类数据，请刷新页面重试",
        })
      }
    }
    
    fetchCategories()
  }, [])

  // 获取讲师列表
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // 实际项目中这里应该调用API获取讲师列表
        // const response = await api.getInstructors()
        // setInstructors(response.data)
        
        // 模拟讲师数据
        setInstructors([
          { id: 1, name: "张教授" },
          { id: 2, name: "王医生" },
          { id: 3, name: "李主任" },
          { id: 4, name: "赵护士长" },
          { id: 5, name: "钱医生" },
        ])
      } catch (error) {
        console.error("获取讲师列表失败", error)
        toast({
          variant: "destructive",
          title: "获取讲师列表失败",
          description: "无法加载讲师数据，请刷新页面重试",
        })
      }
    }
    
    fetchInstructors()
  }, [])

  // 如果是编辑模式，加载视频数据
  useEffect(() => {
    if (videoId) {
      const fetchVideoData = async () => {
        try {
          setIsLoading(true)
          // 实际项目中这里应该调用API获取视频详情
          // const response = await videoApi.getVideoById(videoId)
          // const videoData = response.data
          
          // 模拟视频数据
          const videoData = {
            id: videoId,
            title: "医疗团队协作",
            description: "本视频详细讲解医疗团队协作的重要性和具体方法，适合所有医护人员观看学习。",
            categoryId: "3",
            instructorId: "3",
            accessType: "internal",
            status: "published",
            videoUrl: "https://www.bilibili.com/video/BV1c4411p7gG/", 
            thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            duration: 1800, // 30分钟
          }
          
          // 设置表单初始值
          form.reset({
            title: videoData.title,
            description: videoData.description,
            categoryId: videoData.categoryId,
            instructorId: videoData.instructorId,
            accessType: videoData.accessType as "external" | "internal",
            status: videoData.status as "draft" | "published" | "archived",
            duration: videoData.duration,
          })
          
          // 设置预览
          setVideoPreview(videoData.videoUrl)
          setThumbnailPreview(videoData.thumbnailUrl)
        } catch (error) {
          console.error("获取视频数据失败", error)
          toast({
            variant: "destructive",
            title: "获取视频数据失败",
            description: "无法加载视频数据，请刷新页面重试",
          })
        } finally {
          setIsLoading(false)
        }
      }
      
      fetchVideoData()
    }
  }, [videoId, form])

  // 处理视频文件上传预览
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("videoFile", file)
      const videoUrl = URL.createObjectURL(file)
      setVideoPreview(videoUrl)
      
      // 获取视频时长
      const video = document.createElement("video")
      video.onloadedmetadata = () => {
        form.setValue("duration", Math.floor(video.duration))
      }
      video.src = videoUrl
    }
  }

  // 处理缩略图文件上传预览
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("thumbnailFile", file)
      const imageUrl = URL.createObjectURL(file)
      setThumbnailPreview(imageUrl)
    }
  }

  // 清除视频预览
  const clearVideoPreview = () => {
    form.setValue("videoFile", undefined)
    if (videoPreview && !videoPreview.startsWith("/")) {
      URL.revokeObjectURL(videoPreview)
    }
    setVideoPreview(null)
  }

  // 清除缩略图预览
  const clearThumbnailPreview = () => {
    form.setValue("thumbnailFile", undefined)
    if (thumbnailPreview && !thumbnailPreview.startsWith("/")) {
      URL.revokeObjectURL(thumbnailPreview)
    }
    setThumbnailPreview(null)
  }

  // 提交表单
  const onSubmit = async (data: VideoFormValues) => {
    try {
      setIsLoading(true)
      
      // 创建FormData实例用于文件上传
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("categoryId", data.categoryId)
      formData.append("instructorId", data.instructorId)
      formData.append("accessType", data.accessType)
      formData.append("status", data.status)
      
      if (data.duration) {
        formData.append("duration", data.duration.toString())
      }
      
      if (data.videoFile) {
        formData.append("videoFile", data.videoFile)
      }
      
      if (data.thumbnailFile) {
        formData.append("thumbnailFile", data.thumbnailFile)
      }
      
      if (videoId) {
        // 更新现有视频
        // await videoApi.updateVideo(videoId, formData)
        console.log("更新视频数据", formData)
        toast({
          title: "视频更新成功",
          description: "视频信息已成功更新",
        })
      } else {
        // 创建新视频
        // await videoApi.createVideo(formData)
        console.log("创建新视频", formData)
        toast({
          title: "视频创建成功",
          description: "新视频已成功上传到系统",
        })
      }
      
      // 调用成功回调或跳转
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/admin/videos")
      }
    } catch (error) {
      console.error("提交视频表单失败", error)
      toast({
        variant: "destructive",
        title: "操作失败",
        description: videoId ? "更新视频失败，请重试" : "上传视频失败，请重试",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6 md:col-span-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>视频标题</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入视频标题" {...field} />
                  </FormControl>
                  <FormDescription>简洁明了的标题能吸引更多观看</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>视频描述</FormLabel>
                  <FormControl>
                    <Textarea placeholder="请输入视频详细描述" {...field} className="h-32" />
                  </FormControl>
                  <FormDescription>详细描述视频内容，方便用户了解和搜索</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>视频分类</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择视频分类" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="instructorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>讲师</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择讲师" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id.toString()}>
                            {instructor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="accessType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>访问类型</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择访问类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="external">公开课程（非会员可观看5分钟）</SelectItem>
                        <SelectItem value="internal">会员专享</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>状态</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择状态" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">草稿</SelectItem>
                        <SelectItem value="published">已发布</SelectItem>
                        <SelectItem value="archived">已归档</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <div className="space-y-6 md:col-span-1">
            <FormItem>
              <FormLabel>视频文件</FormLabel>
              <div className="mt-2">
                {videoPreview ? (
                  <div className="relative">
                    <video 
                      src={videoPreview} 
                      className="w-full h-auto rounded-md border border-border" 
                      controls
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70"
                      onClick={clearVideoPreview}
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">点击选择或拖拽视频文件到这里</p>
                      <p className="text-xs text-muted-foreground mt-1">支持 MP4, WebM 格式，最大 500MB</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="video-upload"
                        accept="video/mp4,video/webm"
                        onChange={handleVideoFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById("video-upload")?.click()}
                      >
                        选择视频文件
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <FormDescription>上传高质量的视频文件，系统支持自动转码</FormDescription>
            </FormItem>
            
            <FormItem>
              <FormLabel>缩略图</FormLabel>
              <div className="mt-2">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img 
                      src={thumbnailPreview} 
                      alt="视频缩略图" 
                      className="w-full h-auto rounded-md border border-border object-cover aspect-video" 
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-black/50 p-1 rounded-full hover:bg-black/70"
                      onClick={clearThumbnailPreview}
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">点击选择或拖拽图片文件到这里</p>
                      <p className="text-xs text-muted-foreground mt-1">支持 JPG, PNG 格式，建议尺寸 1280×720</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="thumbnail-upload"
                        accept="image/jpeg,image/png"
                        onChange={handleThumbnailFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById("thumbnail-upload")?.click()}
                      >
                        选择缩略图
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
              <FormDescription>上传视频的封面图片，如不上传将自动从视频中截取</FormDescription>
            </FormItem>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/videos")}
          >
            取消
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {videoId ? "更新视频" : "上传视频"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 