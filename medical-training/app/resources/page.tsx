import Link from "next/link"
import { ArrowRight, Download, FileText, Video, Book, Globe, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import NavBar from "@/components/navbar"

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <NavBar />

      <main className="container py-12">
        {/* 标题部分 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">医护学习资源</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            探索丰富的医护学习资源，提升您的专业技能和知识
          </p>
        </div>

        {/* 搜索栏 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="搜索资源..." className="pl-10 py-6 text-lg" />
            <Button className="absolute right-1 top-1/2 transform -translate-y-1/2">搜索</Button>
          </div>
        </div>

        {/* 资源分类标签 */}
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="documents">文档</TabsTrigger>
            <TabsTrigger value="videos">视频</TabsTrigger>
            <TabsTrigger value="books">电子书</TabsTrigger>
            <TabsTrigger value="websites">网站</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 文档资源 */}
              {[
                {
                  title: "基础护理操作规范",
                  description: "详细介绍基础护理操作的标准流程和注意事项",
                  type: "document",
                  format: "PDF",
                  size: "2.5MB",
                  date: "2025-03-15",
                  isMemberOnly: false,
                },
                {
                  title: "急救药物使用指南",
                  description: "常见急救药物的使用方法、剂量和注意事项",
                  type: "document",
                  format: "PDF",
                  size: "3.2MB",
                  date: "2025-02-20",
                  isMemberOnly: true,
                },
                {
                  title: "心肺复苏最新指南",
                  description: "最新版心肺复苏技术指南和操作流程",
                  type: "document",
                  format: "PDF",
                  size: "4.1MB",
                  date: "2025-01-10",
                  isMemberOnly: false,
                },
                {
                  title: "医疗设备操作视频",
                  description: "常用医疗设备的详细操作演示视频",
                  type: "video",
                  duration: "45分钟",
                  date: "2025-03-05",
                  isMemberOnly: false,
                },
                {
                  title: "患者沟通技巧讲解",
                  description: "如何与不同类型的患者进行有效沟通",
                  type: "video",
                  duration: "30分钟",
                  date: "2025-02-15",
                  isMemberOnly: true,
                },
                {
                  title: "《现代护理学基础》",
                  description: "全面介绍现代护理学的基本理论和实践",
                  type: "book",
                  pages: "520页",
                  date: "2024-12-01",
                  isMemberOnly: true,
                },
                {
                  title: "《急诊医学手册》",
                  description: "急诊医学实用手册，包含常见急症处理方法",
                  type: "book",
                  pages: "380页",
                  date: "2025-01-20",
                  isMemberOnly: false,
                },
                {
                  title: "中国医师协会",
                  description: "提供医学继续教育和专业资源的官方网站",
                  type: "website",
                  url: "https://www.example.com/medical-association",
                  isMemberOnly: false,
                },
                {
                  title: "国际护理研究数据库",
                  description: "收集全球最新护理研究成果和论文的数据库",
                  type: "website",
                  url: "https://www.example.com/nursing-research",
                  isMemberOnly: true,
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.isMemberOnly && <Badge variant="secondary">会员专享</Badge>}
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      {resource.type === "document" && (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>
                            {resource.format} · {resource.size}
                          </span>
                        </>
                      )}
                      {resource.type === "video" && (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          <span>{resource.duration}</span>
                        </>
                      )}
                      {resource.type === "book" && (
                        <>
                          <Book className="mr-2 h-4 w-4" />
                          <span>{resource.pages}</span>
                        </>
                      )}
                      {resource.type === "website" && (
                        <>
                          <Globe className="mr-2 h-4 w-4" />
                          <span>外部网站</span>
                        </>
                      )}
                      <span className="mx-2">·</span>
                      <span>{resource.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {resource.type === "website" ? (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          访问网站
                        </a>
                      </Button>
                    ) : resource.isMemberOnly ? (
                      <Button className="w-full">
                        {resource.type === "document" || resource.type === "book" ? (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            会员下载
                          </>
                        ) : (
                          <>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            会员观看
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button className="w-full">
                        {resource.type === "document" || resource.type === "book" ? (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            免费下载
                          </>
                        ) : (
                          <>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            免费观看
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 文档资源 */}
              {[
                {
                  title: "基础护理操作规范",
                  description: "详细介绍基础护理操作的标准流程和注意事项",
                  format: "PDF",
                  size: "2.5MB",
                  date: "2025-03-15",
                  isMemberOnly: false,
                },
                {
                  title: "急救药物使用指南",
                  description: "常见急救药物的使用方法、剂量和注意事项",
                  format: "PDF",
                  size: "3.2MB",
                  date: "2025-02-20",
                  isMemberOnly: true,
                },
                {
                  title: "心肺复苏最新指南",
                  description: "最新版心肺复苏技术指南和操作流程",
                  format: "PDF",
                  size: "4.1MB",
                  date: "2025-01-10",
                  isMemberOnly: false,
                },
                {
                  title: "静脉输液操作标准",
                  description: "静脉输液的标准操作流程和注意事项",
                  format: "PDF",
                  size: "2.8MB",
                  date: "2025-03-01",
                  isMemberOnly: false,
                },
                {
                  title: "医院感染控制手册",
                  description: "医院感染控制的标准流程和防护措施",
                  format: "PDF",
                  size: "5.3MB",
                  date: "2025-02-10",
                  isMemberOnly: true,
                },
                {
                  title: "常见疾病护理方案",
                  description: "常见疾病的护理方案和注意事项",
                  format: "PDF",
                  size: "6.2MB",
                  date: "2025-01-05",
                  isMemberOnly: true,
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.isMemberOnly && <Badge variant="secondary">会员专享</Badge>}
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>
                        {resource.format} · {resource.size}
                      </span>
                      <span className="mx-2">·</span>
                      <span>{resource.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {resource.isMemberOnly ? (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        会员下载
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        免费下载
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 视频资源 */}
              {[
                {
                  title: "医疗设备操作视频",
                  description: "常用医疗设备的详细操作演示视频",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "45分钟",
                  date: "2025-03-05",
                  isMemberOnly: false,
                },
                {
                  title: "患者沟通技巧讲解",
                  description: "如何与不同类型的患者进行有效沟通",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "30分钟",
                  date: "2025-02-15",
                  isMemberOnly: true,
                },
                {
                  title: "急救技能演示",
                  description: "常见急救技能的详细演示和讲解",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "50分钟",
                  date: "2025-01-25",
                  isMemberOnly: false,
                },
                {
                  title: "护理记录规范讲解",
                  description: "标准护理记录的书写方法和注意事项",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "25分钟",
                  date: "2025-03-10",
                  isMemberOnly: true,
                },
                {
                  title: "医疗团队协作培训",
                  description: "医疗团队协作的重要性和方法",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "40分钟",
                  date: "2025-02-05",
                  isMemberOnly: false,
                },
                {
                  title: "医疗纠纷处理技巧",
                  description: "如何有效预防和处理医疗纠纷",
                  thumbnail: "/placeholder.svg?height=150&width=250",
                  duration: "35分钟",
                  date: "2025-01-15",
                  isMemberOnly: true,
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={resource.thumbnail || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                      {resource.duration}
                    </div>
                    {resource.isMemberOnly && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        会员专享
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Video className="mr-2 h-4 w-4" />
                      <span>{resource.duration}</span>
                      <span className="mx-2">·</span>
                      <span>{resource.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {resource.isMemberOnly ? (
                      <Button className="w-full">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        会员观看
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        免费观看
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 电子书资源 */}
              {[
                {
                  title: "《现代护理学基础》",
                  description: "全面介绍现代护理学的基本理论和实践",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "张教授",
                  pages: "520页",
                  date: "2024-12-01",
                  isMemberOnly: true,
                },
                {
                  title: "《急诊医学手册》",
                  description: "急诊医学实用手册，包含常见急症处理方法",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "李博士",
                  pages: "380页",
                  date: "2025-01-20",
                  isMemberOnly: false,
                },
                {
                  title: "《医患沟通艺术》",
                  description: "医患沟通的技巧和案例分析",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "王主任",
                  pages: "280页",
                  date: "2025-02-10",
                  isMemberOnly: true,
                },
                {
                  title: "《医疗设备使用指南》",
                  description: "常用医疗设备的使用方法和维护",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "陈工程师",
                  pages: "420页",
                  date: "2025-03-05",
                  isMemberOnly: false,
                },
                {
                  title: "《临床护理实践》",
                  description: "临床护理实践的案例和经验分享",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "刘护士长",
                  pages: "350页",
                  date: "2025-01-15",
                  isMemberOnly: true,
                },
                {
                  title: "《医疗质量管理》",
                  description: "医疗质量管理的理论和实践",
                  cover: "/placeholder.svg?height=300&width=200",
                  author: "赵主任",
                  pages: "400页",
                  date: "2025-02-25",
                  isMemberOnly: false,
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="flex p-4">
                    <img
                      src={resource.cover || "/placeholder.svg"}
                      alt={resource.title}
                      className="w-24 h-36 object-cover rounded"
                    />
                    <div className="ml-4 flex flex-col">
                      <h3 className="font-bold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">作者: {resource.author}</p>
                      <p className="text-sm text-muted-foreground">{resource.pages}</p>
                      <p className="text-sm text-muted-foreground">{resource.date}</p>
                      {resource.isMemberOnly && (
                        <Badge variant="secondary" className="mt-2 self-start">
                          会员专享
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="pb-2">
                    <p className="text-sm">{resource.description}</p>
                  </CardContent>
                  <CardFooter>
                    {resource.isMemberOnly ? (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        会员下载
                      </Button>
                    ) : (
                      <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        免费下载
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="websites" className="mt-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* 网站资源 */}
              {[
                {
                  title: "中国医师协会",
                  description: "提供医学继续教育和专业资源的官方网站",
                  url: "https://www.example.com/medical-association",
                  category: "专业协会",
                  isMemberOnly: false,
                },
                {
                  title: "国际护理研究数据库",
                  description: "收集全球最新护理研究成果和论文的数据库",
                  url: "https://www.example.com/nursing-research",
                  category: "研究数据库",
                  isMemberOnly: true,
                },
                {
                  title: "医学教育资源网",
                  description: "提供丰富的医学教育资源和在线课程",
                  url: "https://www.example.com/medical-education",
                  category: "教育资源",
                  isMemberOnly: false,
                },
                {
                  title: "临床指南数据库",
                  description: "收集国内外最新临床诊疗指南的数据库",
                  url: "https://www.example.com/clinical-guidelines",
                  category: "临床指南",
                  isMemberOnly: true,
                },
                {
                  title: "医学图像资源库",
                  description: "提供丰富的医学图像和案例资源",
                  url: "https://www.example.com/medical-images",
                  category: "图像资源",
                  isMemberOnly: false,
                },
                {
                  title: "医疗器械信息平台",
                  description: "提供最新医疗器械信息和使用指南",
                  url: "https://www.example.com/medical-devices",
                  category: "器械信息",
                  isMemberOnly: true,
                },
              ].map((resource, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      {resource.isMemberOnly && <Badge variant="secondary">会员专享</Badge>}
                    </div>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Globe className="mr-2 h-4 w-4" />
                      <span>{resource.category}</span>
                    </div>
                    <p className="text-sm text-blue-500 truncate mt-1">{resource.url}</p>
                  </CardContent>
                  <CardFooter>
                    {resource.isMemberOnly ? (
                      <Button className="w-full">会员访问</Button>
                    ) : (
                      <Button variant="outline" className="w-full" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          访问网站
                        </a>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 推荐资源 */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">推荐资源</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "心肺复苏最新指南",
                description: "最新版心肺复苏技术指南和操作流程",
                type: "document",
                icon: <FileText className="h-8 w-8" />,
                isMemberOnly: false,
              },
              {
                title: "急救技能演示",
                description: "常见急救技能的详细演示和讲解",
                type: "video",
                icon: <Video className="h-8 w-8" />,
                isMemberOnly: false,
              },
              {
                title: "《急诊医学手册》",
                description: "急诊医学实用手册，包含常见急症处理方法",
                type: "book",
                icon: <Book className="h-8 w-8" />,
                isMemberOnly: false,
              },
              {
                title: "医学教育资源网",
                description: "提供丰富的医学教育资源和在线课程",
                type: "website",
                icon: <Globe className="h-8 w-8" />,
                isMemberOnly: false,
              },
            ].map((resource, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {resource.icon}
                  </div>
                  <h3 className="font-bold mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="outline" className="w-full">
                    {resource.type === "document" || resource.type === "book"
                      ? "下载"
                      : resource.type === "video"
                        ? "观看"
                        : "访问"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 资源订阅 */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">订阅资源更新</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            订阅我们的资源更新，第一时间获取最新的医护学习资源和专业知识
          </p>
          <div className="flex max-w-md mx-auto">
            <Input type="email" placeholder="请输入您的邮箱" className="rounded-r-none" />
            <Button className="rounded-l-none">订阅</Button>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">关于我们</h4>
              <p className="text-gray-300">
                医护培训平台致力于为医护人员提供高质量的专业培训课程， 助力医护人员职业发展。
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/" className="hover:text-white">
                    首页
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="hover:text-white">
                    课程
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    资源
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    关于我们
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">联系我们</h4>
              <ul className="space-y-2 text-gray-300">
                <li>电话: 400-123-4567</li>
                <li>邮箱: contact@medical-training.com</li>
                <li>地址: 北京市海淀区医学科技园</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">关注我们</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">微信</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.5,13.5A1.5,1.5 0 0,1 7,12A1.5,1.5 0 0,1 8.5,10.5A1.5,1.5 0 0,1 10,12A1.5,1.5 0 0,1 8.5,13.5M15.5,13.5A1.5,1.5 0 0,1 14,12A1.5,1.5 0 0,1 15.5,10.5A1.5,1.5 0 0,1 17,12A1.5,1.5 0 0,1 15.5,13.5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">微博</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.3,12.7 C19.9,12.3 19.4,12.1 18.8,12.1 C18.2,12.1 17.7,12.3 17.3,12.7 C16.9,13.1 16.7,13.6 16.7,14.2 C16.7,14.8 16.9,15.3 17.3,15.7 C17.7,16.1 18.2,16.3 18.8,16.3 C19.4,16.3 19.9,16.1 20.3,15.7 C20.7,15.3 20.9,14.8 20.9,14.2 C20.9,13.6 20.7,13.1 20.3,12.7 Z M9.9,18.8 C7.4,18.8 5.4,17.9 3.9,16.2 C2.4,14.5 1.6,12.4 1.6,9.9 C1.6,7.4 2.4,5.3 3.9,3.6 C5.4,1.9 7.4,1 9.9,1 C12.4,1 14.5,1.9 16,3.6 C17.5,5.3 18.3,7.4 18.3,9.9 C18.3,12.4 17.5,14.5 16,16.2 C14.5,17.9 12.4,18.8 9.9,18.8 Z M9.9,4.8 C8.2,4.8 6.8,5.4 5.7,6.5 C4.6,7.6 4,9 4,10.7 C4,12.4 4.6,13.8 5.7,14.9 C6.8,16 8.2,16.6 9.9,16.6 C11.6,16.6 13,16 14.1,14.9 C15.2,13.8 15.8,12.4 15.8,10.7 C15.8,9 15.2,7.6 14.1,6.5 C13,5.4 11.6,4.8 9.9,4.8 Z M9.9,13.9 C9.1,13.9 8.4,13.6 7.9,13.1 C7.4,12.6 7.1,11.9 7.1,11.1 C7.1,10.3 7.4,9.6 7.9,9.1 C8.4,8.6 9.1,8.3 9.9,8.3 C10.7,8.3 11.4,8.6 11.9,9.1 C12.4,9.6 12.7,10.3 12.7,11.1 C12.7,11.9 12.4,12.6 11.9,13.1 C11.4,13.6 10.7,13.9 9.9,13.9 Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 医护培训平台 版权所有 | 京ICP备12345678号</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
