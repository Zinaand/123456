"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { VideoForm } from "@/components/video-form"
import { Button } from "@/components/ui/button"

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href="/admin/videos">
                <ChevronLeft className="h-4 w-4" />
                返回
              </Link>
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2">上传新视频</h2>
          <p className="text-muted-foreground">添加新的视频课程到系统</p>
        </div>
      </div>

      <VideoForm />
    </div>
  )
} 