"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import dayjs from "dayjs"
import { Calendar, Clock, MapPin, ChevronRight, Play, Users } from "lucide-react"
import EnrollButton from "./enroll-button"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"
import { formatToNaira } from "@/lib/utils"
interface CourseHeroProps {
  data: any
  type: "course" | "event"
  onPlayVideo: () => void
}

export function CourseHero({ data, type, onPlayVideo }: CourseHeroProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: i * 0.1,
      },
    }),
  }

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const hasVideo = data.videos?.length > 0 || data.videoUrl

  return (
    <>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="pt-28 pb-16 md:pt-32 md:pb-20   bg-[url('/images/bg-hero.jpg')] bg-fixed shadow-[inset_0px_0px_0px_1000px_#f9f9f990] bg-cover bg-center relative overflow-hidden"
      >
        {/* Background Elements */}


        <div className="container mx-auto px-4">
          <div className="flex flex-col  bg-[radial-gradient(circle_at_center,_10%_10%,_#FDC332_0%,_white_70%)] items-center text-center mb-12">
            <motion.div variants={fadeIn} custom={0} className="flex flex-wrap items-center justify-center gap-3 mb-4">
              <motion.span
                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                whileHover={{ scale: 1.05 }}
              >
                {type === "course" ? "Course" : "Event"}
              </motion.span>
              {data.category && (
                <>
                  <ChevronRight className="w-4 h-4 text-zinc-400" />
                  <motion.span
                    className="px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {data.category}
                  </motion.span>
                </>
              )}
            </motion.div>

            <motion.h1
              variants={fadeIn}
              custom={1}
              className="text-4xl md:text-5xl font-bold text-zinc-900 mb-4 max-w-4xl"
            >
              {data.title}
            </motion.h1>

            <motion.p variants={fadeIn} custom={2} className="text-lg text-zinc-600 mb-6 max-w-2xl">
              {data.about.length > 150 ? `${data.about.substring(0, 150)}...` : data.about}
            </motion.p>

            <motion.div variants={fadeIn} custom={3} className="flex flex-wrap justify-center gap-4 mb-8">
              <motion.div
                className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full"
                whileHover={{ scale: 1.05 }}
              >
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-zinc-700">
                  {dayjs(data.startDate).format("MMM D, YYYY")}
                  {data.endDate && <span> - {dayjs(data.endDate).format("MMM D, YYYY")}</span>}
                </span>
              </motion.div>

              {data.duration !== 0 && (
                <motion.div
                  className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-zinc-700">{data.duration} hours</span>
                </motion.div>
              )}

              {data.type && (
                <motion.div
                  className="flex items-center gap-2 bg-white shadow-sm px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-zinc-700 capitalize">{data.type}</span>
                </motion.div>
              )}
            </motion.div>
            <EnrollButton
              type={type}
              data={data}
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all hover:shadow-lg"
            />
            <motion.div variants={fadeIn} custom={4} className="flex flex-wrap gap-4 items-center justify-center">


              {hasVideo && (
                <motion.button
                  onClick={onPlayVideo}
                  className="flex items-center gap-2 text-zinc-700 hover:text-primary transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  >
                    <Play className="w-4 h-4 text-primary ml-0.5" />
                  </motion.div>
                  <span className="font-medium">Watch Preview</span>
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Course Image */}
          <motion.div variants={scaleUp} className="max-w-4xl mx-auto z-50 shadow-[3px_3px_40px_40px_#00000016]">
            {data.thumbnail && (
              <motion.div className="relative   rounded-xl overflow-hidden shadow-xl duration-300" whileHover={{ scale: 1.01 }}>
                <Image
                  src={data.thumbnail.url || "/placeholder.svg"}
                  alt={data.title}
                  width={1200}
                  height={600}
                  className="w-full aspect-[2/1] object-cover "
                />

                {(data.enrolledStudents?.length || 0) > 0 && (
                  <motion.div
                    className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full flex items-center gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{data.enrolledStudents?.length} enrolled</span>
                  </motion.div>
                )}

                {data.fee > 0 ? (
                  <motion.div
                    className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-bold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {formatToNaira(data.fee)}
                  </motion.div>
                ) : (
                  <motion.div
                    className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Free
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

      </motion.section>
    </>
  )
}
