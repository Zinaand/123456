import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  // 模拟课程数据
  const courses = [
    {
      id: 1,
      title: "心肺复苏技术专项培训",
      description: "掌握专业急救技术，提高抢救成功率",
      lessons: 20,
      level: "初级",
      category: "急救技能"
    },
    {
      id: 2,
      title: "护理人员规范操作实践",
      description: "提升护理人员的专业操作规范性和安全意识",
      lessons: 15,
      level: "中级",
      category: "护理技能"
    },
    {
      id: 3,
      title: "医学影像诊断进阶班",
      description: "系统学习X光、CT、核磁共振等影像学诊断技术",
      lessons: 25,
      level: "高级",
      category: "诊断技术"
    },
    {
      id: 4, 
      title: "患者沟通技巧训练",
      description: "提高医患沟通能力，减少医患矛盾",
      lessons: 12,
      level: "初级",
      category: "沟通技巧"
    },
    {
      id: 5,
      title: "手术室无菌技术与操作",
      description: "掌握手术室无菌观念和操作技能",
      lessons: 18,
      level: "中级",
      category: "手术技能"
    },
    {
      id: 6,
      title: "新冠疫情防控专题培训",
      description: "了解最新防疫知识和防护技能",
      lessons: 10,
      level: "初级",
      category: "传染病防控"
    }
  ];

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
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground">课程缩略图</span>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex gap-2 mb-2">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {course.category}
                </span>
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  {course.level}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">{course.lessons} 课时</div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Link href={`/courses/${course.id}`}>
                <Button variant="secondary" size="sm">查看详情</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
} 