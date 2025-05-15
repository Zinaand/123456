"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { VideoForm } from "@/components/video-form"
import { Button } from "@/components/ui/button"

export default function EditVideoPage({ params }: { params: { id: string } }) {
  const videoId = parseInt(params.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1" asChild>
              <Link href={`/admin/videos/${params.id}`}>
                <ChevronLeft className="h-4 w-4" />
                返回
              </Link>
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-2">编辑视频</h2>
          <p className="text-muted-foreground">修改视频信息和资源</p>
        </div>
      </div>

      <VideoForm videoId={videoId} />
    </div>
  )
} 