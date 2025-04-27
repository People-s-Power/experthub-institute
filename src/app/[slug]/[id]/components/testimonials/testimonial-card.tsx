"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import type { TestimonialType } from "./testimonial-types"

interface TestimonialCardProps {
  testimonial: TestimonialType
  index: number
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
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

  const cardHover = {
    rest: { scale: 1 },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  // Convert rating to stars (e.g., 4.7 -> 5 stars with the last one partially filled)
  const fullStars = Math.floor(testimonial.rating)
  const partialStar = testimonial.rating % 1
  const emptyStars = 5 - fullStars - (partialStar > 0 ? 1 : 0)

  return (
    <motion.div
      variants={fadeIn}
      custom={index + 2}
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="p-5 rounded-lg bg-white border border-zinc-100 shadow-sm"
    >
      <div className="flex gap-1 mb-3">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}

        {partialStar > 0 && (
          <div className="relative w-4 h-4">
            <Star className="absolute w-4 h-4 text-zinc-300" />
            <div className="absolute overflow-hidden" style={{ width: `${partialStar * 100}%` }}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}

        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-zinc-300" />
        ))}

        <span className="ml-1 text-xs text-zinc-500 self-center">{testimonial.rating.toFixed(1)}</span>
      </div>

      <p className="text-zinc-700 mb-4 text-sm">"{testimonial.text}"</p>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            width={32}
            height={32}
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <p className="font-medium text-zinc-900 text-sm">{testimonial.name}</p>
          <p className="text-xs text-zinc-600">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}
