"use client"

import { motion } from "framer-motion"
import { Clock, Users, Award, HeadphonesIcon } from "lucide-react"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"

interface CourseStatsProps {
  data: CourseTypeSingle | EventTypeSingle
  benefits: string[]
}

export function CourseStats({ data, benefits }: CourseStatsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-y py-12 border-zinc-100"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div
            className="p-4 py-8 rounded-[8px] relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 shadow-[0px_0px_20px_0px_rgba(200,200,150,0.3)] duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px 5px rgba(200,200,150,0.4)",
            }}
          >
            <div className="absolute -right-4 -top-4 opacity-10">
              <Clock className="w-24 h-24 text-primary" />
            </div>
            <motion.div
              className="text-3xl font-bold text-primary mb-1 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {data.duration || 10}+
            </motion.div>
            <motion.div
              className="text-zinc-600 text-sm relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Hours of Content
            </motion.div>
          </motion.div>

          <motion.div
            className="p-4 py-8 rounded-[8px] relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 shadow-[0px_0px_20px_0px_rgba(200,200,150,0.3)] duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px 5px rgba(200,200,150,0.4)",
            }}
          >
            <div className="absolute -right-4 -top-4 opacity-10">
              <Users className="w-24 h-24 text-primary" />
            </div>
            <motion.div
              className="text-3xl font-bold text-primary mb-1 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {data.enrolledStudents?.length || 100}+
            </motion.div>
            <motion.div
              className="text-zinc-600 text-sm relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Students Enrolled
            </motion.div>
          </motion.div>

          <motion.div
            className="p-4 py-8 rounded-[8px] relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 shadow-[0px_0px_20px_0px_rgba(200,200,150,0.3)] duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px 5px rgba(200,200,150,0.4)",
            }}
          >
            <div className="absolute -right-4 -top-4 opacity-10">
              <Award className="w-24 h-24 text-primary" />
            </div>
            <motion.div
              className="text-3xl font-bold text-primary mb-1 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {benefits.length || 5}+
            </motion.div>
            <motion.div
              className="text-zinc-600 text-sm relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              Key Skills
            </motion.div>
          </motion.div>

          <motion.div
            className="p-4 py-8 rounded-[8px] relative overflow-hidden bg-gradient-to-br from-white to-zinc-50 shadow-[0px_0px_20px_0px_rgba(200,200,150,0.3)] duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px 5px rgba(200,200,150,0.4)",
            }}
          >
            <div className="absolute -right-4 -top-4 opacity-10">
              <HeadphonesIcon className="w-24 h-24 text-primary" />
            </div>
            <motion.div
              className="text-3xl font-bold text-primary mb-1 relative z-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              24/7
            </motion.div>
            <motion.div
              className="text-zinc-600 text-sm relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              Support Access
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
