"use client"

import { motion } from "framer-motion"
import { Video, BookOpen, Award, Zap, Users } from "lucide-react"
import EnrollButton from "./enroll-button"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"
import { formatToNaira } from "@/lib/utils"
import ShareButton from "./share"

interface CourseSidebarProps {
  data: CourseTypeSingle | EventTypeSingle
  type: "course" | "event"
}

export function CourseSidebar({ data, type }: CourseSidebarProps) {
  const cardHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  return (
    <div className="lg:col-span-1">
      <EnrollButton
        type={type}
        data={data}
        id="enroll"
        className=" hidden "
      />
      <div className=" sticky top-24 space-y-6">
        <div


          className="bg-white rounded-lg border border-zinc-100 shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-zinc-100">
            <div className="flex items-center justify-between mb-3">
              {data.fee > 0 ? (
                <div>
                  <p className="text-2xl font-bold text-zinc-900">{formatToNaira(data.fee)}</p>
                  {data.strikedFee ? <p className="text-zinc-400 line-through text-sm">{formatToNaira(data.strikedFee)}</p> : ""}
                </div>
              ) : (
                <p className="text-2xl font-bold text-green-500">Free</p>
              )}

              {data.target && (
                <div className="text-right">
                  <p className="text-xs text-zinc-500">Limited Seats</p>
                  <p className="font-medium text-zinc-900 text-sm">{data.target} spots</p>
                </div>
              )}
            </div>

            {(data.enrolledStudents?.length || 0 > 0) && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                <Users className="w-3 h-3" />
                <span>{data.enrolledStudents?.length} students enrolled</span>
              </div>
            )}

            <button onClick={() => {
              document.getElementById("enroll")?.click()
            }} className="w-full bg-primary  hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all mb-3">

              {data.fee > 0
                ? `Enroll for ${formatToNaira(data.fee)}`
                : type === "course"
                  ? "Enroll for Free"
                  : "Register Now"}
            </button>

            <p className="text-center text-xs text-zinc-500">30-day money-back guarantee</p>
          </div>

          <div className="p-5">
            <h3 className="font-medium text-sm mb-3 text-zinc-900">This {type} includes:</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-zinc-700">{data.duration || 10}+ hours of video content</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-zinc-700">Comprehensive learning materials</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-zinc-700">Certificate of completion</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-primary" />
                </div>
                <span className="text-zinc-700">Lifetime access to materials</span>
              </li>
            </ul>

            <div>
              <ShareButton instructorId={((data as CourseTypeSingle).instructorId || (data as EventTypeSingle).authorId) as string} title={data.title} about={data.about} urlToShare={`${window.location.origin}/${type}s/${data._id}`} />
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}
