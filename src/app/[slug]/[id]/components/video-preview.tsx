"use client"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause } from "lucide-react"

interface VideoPreviewProps {
  data: {
    videoUrl?: string
    videos?: {
      title: string
      videoUrl: string
    }[]
    thumbnail?: {
      type: string
      url: string
    }
    title?: string
  }
  isPlaying?: boolean
  onPlay?: () => void
}

export const VideoPreview = ({ data, isPlaying: externalIsPlaying, onPlay }: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(externalIsPlaying || false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Get video URL - handle both course (videos array) and event (videoUrl string) cases
  const videoUrl = data.videos && data.videos.length > 0 ? data.videos[0].videoUrl : data.videoUrl

  const videoTitle = data.videos && data.videos.length > 0 ? data.videos[0].title : data.title || "Video Preview"

  // Get thumbnail URL
  const thumbnailUrl = data.thumbnail?.url

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.currentTime >= 30) {
      videoRef.current.pause()
      setIsPlaying(false)
      videoRef.current.currentTime = 0
    }
  }

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
        if (onPlay) onPlay()
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  if (!videoUrl) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl overflow-hidden shadow-lg border border-gray-100"
    >
      <div className="relative aspect-video">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          poster={thumbnailUrl}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>

        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePlayClick}
                className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
              >
                <Play className="w-8 h-8 text-primary ml-1" />
              </motion.button>
              <p className="text-white font-medium mt-4 text-lg">{videoTitle}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {isPlaying && (
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handlePlayClick}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <Pause className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
