"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TestimonialCard } from "./testimonial-card"
import { testimonials } from "./testimonial-data"

export function TestimonialsSection() {
  const [randomTestimonials, setRandomTestimonials] = useState(testimonials.slice(0, 2))

  useEffect(() => {
    // Shuffle and select 2 random testimonials
    const shuffled = [...testimonials].sort(() => 0.5 - Math.random())
    setRandomTestimonials(shuffled.slice(0, 2))
  }, [])

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

  return (
    <motion.section variants={staggerContainer} initial="hidden" animate="visible" className="scroll-mt-24">
      <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
        What Our Students Say
      </motion.h2>

      <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-4">
        {randomTestimonials.map((testimonial, index) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
        ))}
      </motion.div>
    </motion.section>
  )
}
