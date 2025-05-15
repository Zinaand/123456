import Link from "next/link"
import { Clock, Play } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// 这个组件负责展示首页热门课程
export default function FeaturedVideos() {
  // 模拟热门视频数据，实际项目中应从API获取
  const featuredVideos = [
    {
      id: 1,
      title: "基础护理技能培训",
      description: "学习基本护理技能和操作规范，适合新入职护士和护理专业学生",
      duration: "45分钟",
      type: "external", // external:公开, internal:会员专享
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 2,
      title: "高级心肺复苏技术",
      description: "掌握最新的心肺复苏技术和急救方法，适合医护人员进阶学习",
      duration: "60分钟",
      type: "internal",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 3,
      title: "医疗设备操作指南",
      description: "详细讲解常见医疗设备的使用方法和注意事项",
      duration: "50分钟",
      type: "internal",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
    {
      id: 4,
      title: "患者沟通技巧",
      description: "提升与患者沟通的能力，建立良好的医患关系",
      duration: "40分钟",
      type: "external",
      thumbnail: "/placeholder.svg?height=180&width=320",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredVideos.map((video) => (
        <Card key={video.id} className="flex flex-col h-full overflow-hidden group hover:shadow-md transition-shadow">
          <div className="relative aspect-video overflow-hidden">
            <img
              alt={video.title}
              className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-300"
              src={video.thumbnail}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="rounded-full bg-white/90 p-2">
                <Play className="h-8 w-8 text-primary" />
              </div>
            </div>
            {video.type === "internal" && (
              <Badge className="absolute top-2 right-2" variant="secondary">
                会员专享
              </Badge>
            )}
          </div>
          <CardHeader className="pb-2 pt-4">
            <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
          </CardContent>
          <CardFooter className="pt-2 flex justify-between items-center">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {video.duration}
            </div>
            <Link href={`/video/${video.id}`}>
              <Button variant="ghost" size="sm">
                观看课程
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}