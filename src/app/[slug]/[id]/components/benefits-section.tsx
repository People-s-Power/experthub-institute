"use client"

import type React from "react"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface BenefitsSectionProps {
  benefits: string[]
  benefitsRef: any
  benefitsControls: any
}

export function BenefitsSection({ benefits, benefitsRef, benefitsControls }: BenefitsSectionProps) {
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

  if (!benefits.length) return null

  return (
    <motion.section
      ref={benefitsRef}
      variants={staggerContainer}
      initial="hidden"
      animate={benefitsControls}
      id="benefits"
      className=""
    >
      <motion.h2 variants={fadeIn} custom={0} className="text-2xl font-bold mb-2 text-zinc-900">
        What You'll Learn
      </motion.h2>

      <motion.div variants={fadeIn} custom={1} className="w-16 h-1 bg-primary rounded-full mb-6" />

      <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            custom={index + 2}
            whileHover="hover"
            initial="rest"
            animate="rest"
            className="flex gap-3 p-4 rounded-lg bg-white border border-zinc-100 shadow-sm"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-zinc-700">{benefit}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
