import Link from "next/link"

import { Button } from "@/components/ui/button"
import NavBar from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <NavBar />

      <main className="container py-12">
        {/* 标题部分 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">关于我们</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            致力于为医护人员提供高质量的专业培训，提升医疗服务水平
          </p>
        </div>

        {/* 使命愿景 */}
        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">我们的使命</h2>
            <p className="text-lg text-muted-foreground mb-4">
              我们致力于通过提供高质量的医护培训课程，帮助医疗专业人员不断提升技能和知识，从而提高医疗服务质量，促进医疗行业的发展。
            </p>
            <p className="text-lg text-muted-foreground">
              我们相信，每一位医护人员的成长都将直接影响到患者的健康和生活质量。因此，我们努力创造一个便捷、高效的学习平台，让医护人员能够随时随地获取最新的医学知识和技能。
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img src="/placeholder.svg?height=400&width=600" alt="医护培训使命" className="w-full h-auto" />
          </div>
        </div>

        {/* 我们的团队 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">我们的团队</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "张教授",
                title: "创始人 & 医学总监",
                bio: "拥有30年临床经验的心脏外科专家，曾在多家三甲医院担任科室主任，致力于医学教育和培训。",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "李博士",
                title: "教学总监",
                bio: "医学教育学博士，曾任医学院副教授，专注于医护人员培训方法研究，开发了多套实用培训课程。",
                image: "/placeholder.svg?height=300&width=300",
              },
              {
                name: "王主任",
                title: "技术总监",
                bio: "资深医疗技术专家，曾主导多家医院信息化建设，将先进技术与医学教育相结合，提升学习体验。",
                image: "/placeholder.svg?height=300&width=300",
              },
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.title}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 我们的历程 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">我们的历程</h2>
          <div className="space-y-12">
            {[
              {
                year: "2020",
                title: "平台创立",
                description: "医护培训平台正式成立，开始提供基础医护课程。",
              },
              {
                year: "2022",
                title: "业务扩展",
                description: "扩大课程范围，增加专科培训和高级技能课程，用户数量突破10,000。",
              },
              {
                year: "2023",
                title: "技术升级",
                description: "引入先进的视频播放和学习进度跟踪技术，提升用户学习体验。",
              },
              {
                year: "2025",
                title: "全面发展",
                description: "推出会员制度和证书认证系统，成为国内领先的医护培训平台。",
              },
            ].map((milestone, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{milestone.year}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 合作伙伴 */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">合作伙伴</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((partner) => (
              <div key={partner} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center">
                <img
                  src={`/placeholder.svg?height=80&width=160&text=合作伙伴${partner}`}
                  alt={`合作伙伴${partner}`}
                  className="max-h-16"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 联系我们 */}
        <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">联系我们</h2>
              <p className="text-lg text-muted-foreground mb-6">
                如果您有任何问题、建议或合作意向，欢迎随时与我们联系。我们的团队将竭诚为您服务。
              </p>
              <div className="space-y-4">
                <div>
                  <p className="font-medium">地址</p>
                  <p className="text-muted-foreground">北京市海淀区医学科技园</p>
                </div>
                <div>
                  <p className="font-medium">电话</p>
                  <p className="text-muted-foreground">400-123-4567</p>
                </div>
                <div>
                  <p className="font-medium">邮箱</p>
                  <p className="text-muted-foreground">contact@medical-training.com</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4">发送消息</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="请输入您的姓名"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="请输入您的邮箱"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    留言
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="请输入您的留言内容"
                  ></textarea>
                </div>
                <Button className="w-full">提交留言</Button>
              </form>
            </div>
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
