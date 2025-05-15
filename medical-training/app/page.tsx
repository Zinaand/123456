import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import FeaturedVideos from "@/components/featured-videos"
import HeroSection from "@/components/hero-section"
import BenefitsSection from "@/components/benefits-section"
import Navbar from "@/components/navbar"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur">
        <Navbar />
      </section>
      
      <main className="flex-1">
        <HeroSection />

        <section className="w-full py-12 md:py-16">
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">热门课程</h2>
                <p className="text-muted-foreground mt-1">探索我们最受欢迎的医护培训课程</p>
              </div>
              <Link href="/courses" className="mt-4 sm:mt-0">
                <Button variant="outline" className="h-9">
                  查看全部 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <FeaturedVideos />
          </div>
        </section>

        <BenefitsSection />

        <section className="bg-muted py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">立即加入我们的会员计划</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground mt-3">
                成为会员后，您将获得无限制访问所有课程内容的权限，包括内部专业资料下载、完整视频观看等特权。
              </p>
            </div>
            
            <div className="mx-auto max-w-md">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-center">专业会员</CardTitle>
                  <CardDescription className="text-center">适合医护专业人员的全方位培训计划</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center mb-4">
                    ¥299<span className="text-sm font-normal text-muted-foreground">/年</span>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      无限制访问所有视频课程
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      内部专业资料下载
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      视频播放进度记忆
                    </li>
                    <li className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4 text-primary"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      专业证书获取
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/payment" className="w-full">
                    <Button className="w-full">立即开通</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8 bg-background">
        <div className="container px-4 md:px-6 mx-auto max-w-screen-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                医护培训
              </Link>
              <nav className="flex gap-4 md:gap-6">
                <Link href="#" className="text-sm hover:underline">
                  隐私政策
                </Link>
                <Link href="#" className="text-sm hover:underline">
                  服务条款
                </Link>
                <Link href="#" className="text-sm hover:underline">
                  联系我们
                </Link>
              </nav>
            </div>
            <p className="text-center text-sm text-muted-foreground">© 2025 医护培训. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}