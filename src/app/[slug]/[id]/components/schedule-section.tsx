"use client"

import type React from "react"

import { motion } from "framer-motion"
import dayjs from "dayjs"
import { Calendar } from "lucide-react"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"

interface ScheduleSectionProps {
  data: CourseTypeSingle | EventTypeSingle
  scheduleRef: any
  scheduleControls: any
}

export function ScheduleSection({ data, scheduleRef, scheduleControls }: ScheduleSectionProps) {
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  if (!data.days || !data.days.length || data.type === "pdf") return null

  return (
    <motion.section
      ref={scheduleRef}
      variants={staggerContainer}
      initial="hidden"
      animate={scheduleControls}
      id="schedule"
      className="scroll-mt-24"
    >
      <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
        Course Schedule
      </motion.h2>

      <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

      <motion.div variants={staggerContainer} className="space-y-3">
        {(data.days)
          .filter((day: any) => day.checked)
          .map((day: any, index: number) => (
            <motion.div
              key={index}
              variants={fadeIn}
              custom={index + 2}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex items-center justify-between p-4 rounded-lg bg-white border border-zinc-100 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-zinc-900">{day.day}s</h3>
                  <p className="text-sm text-zinc-600">Weekly Session</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-zinc-900">
                  {day.startTime
                    ? dayjs(dayjs().format("YYYY-MM-DD") + " " + day.startTime).format("h:mm A")
                    : "Check Venue"}
                </p>
                <p className="text-sm text-zinc-600">
                  {day.endTime
                    ? dayjs(dayjs().format("YYYY-MM-DD") + " " + day.endTime).format("h:mm A")
                    : "Check Venue"}
                </p>
              </div>
            </motion.div>
          ))}
      </motion.div>
    </motion.section>
  )
}
