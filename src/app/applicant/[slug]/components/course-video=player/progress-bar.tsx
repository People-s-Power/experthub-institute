"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  // Ensure progress is between 0 and 100
  const safeProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className="w-full h-1 bg-gray-800 relative">
      <motion.div
        className="absolute top-0 left-0 h-full bg-yellow-500"
        initial={{ width: 0 }}
        animate={{ width: `${safeProgress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  )
}

export default ProgressBar
