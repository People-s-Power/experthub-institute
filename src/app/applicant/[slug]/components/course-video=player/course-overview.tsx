

"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Play, Clock, Award, CheckCircle } from "lucide-react"
import type { CourseType } from "@/types/CourseType"
import { formatTime } from "./video-player"
import ImageViewer from "@/components/ImageViewer"

interface CourseOverviewProps {
    course: CourseType
    onStartCourse: () => void
}

const CourseOverview: React.FC<CourseOverviewProps> = ({ course, onStartCourse }) => {
    // Calculate total videos
    const totalVideos = course.videos.reduce((total, module) => total + 1 + (module.submodules?.length || 0), 0)

    // Calculate total duration in minutes (from all videos)
    const calculateTotalDuration = (): number => {
        let totalDuration = 0

        course.videos.forEach((module) => {
            if (module.duration) {
                totalDuration += module.duration
            }

            if (module.submodules) {
                module.submodules.forEach((submodule: any) => {
                    if (submodule.duration) {
                        totalDuration += submodule.duration
                    }
                })
            }
        })

        return totalDuration || course.duration || 0
    }

    const totalDuration = calculateTotalDuration()

    return (
        <div className="w-full">
            {/* Course Thumbnail */}
            <div className="relative w-full aspect-video bg-gray-800 overflow-hidden rounded-lg">
                {course.thumbnail && <ImageViewer image={course.thumbnail} />}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
                    <motion.button
                        className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black rounded-full p-6 flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStartCourse}
                    >
                        <Play className="w-12 h-12" />
                    </motion.button>
                </div>
            </div>

            {/* Course Info */}
            <div className="p-6 bg-gray-800 rounded-lg mt-4 shadow-lg border border-gray-700/50">
                <h1 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                    {course.title}
                </h1>

                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2 text-yellow-500" />
                        <span>{totalDuration > 0 ? formatTime(totalDuration) : "Duration not available"}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Play className="w-5 h-5 mr-2 text-yellow-500" />
                        <span>{totalVideos} lessons</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                        <Award className="w-5 h-5 mr-2 text-yellow-500" />
                        <span>{course.instructorName}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                        About This Course
                    </h2>
                    <p className="text-gray-300 leading-relaxed">{course.about}</p>
                </div>

                {course.benefits && course.benefits.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">
                            What You'll Learn
                        </h2>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {course.benefits.map((benefit: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <motion.button
                    className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black px-6 py-3 rounded-md font-bold flex items-center shadow-lg"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onStartCourse}
                >
                    <Play className="w-5 h-5 mr-2" />
                    Start Course
                </motion.button>
            </div>
        </div>
    )
}

export default CourseOverview
