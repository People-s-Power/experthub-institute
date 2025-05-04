'use client'

import { motion } from 'framer-motion'
import { Lightbulb, School, ClockIcon, PhoneIcon, BookOpen, Users } from 'lucide-react'

const features = [
    {
        name: 'Expert Instructors',
        description: 'Learn from industry professionals and subject matter experts.',
        icon: School,
    },
    {
        name: 'Flexible Learning',
        description: 'Study at your own pace, anytime and anywhere.',
        icon: ClockIcon,
    },
    {
        name: 'Interactive Content',
        description: 'Engage with dynamic and interactive course materials.',
        icon: Lightbulb,
    },
    {
        name: 'Mentorship Program',
        description: 'Empowering growth through guidance, support, and one-on-one mentorship.',
        icon: PhoneIcon,
    },
    {
        name: 'Comprehensive Training',
        description: 'Cover a wide spectrum of tech skills for a well-rounded education.',
        icon: BookOpen,
    },
    {
        name: 'Career Placement',
        description: 'Get help securing employment or internships after completing your training.',
        icon: Users,
    },
]

export default function Features() {
    return (
        <motion.section
            id="features"
            className="py-12 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                    <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        A better way to learn
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        Our platform offers cutting-edge features designed to enhance your learning experience and help you achieve your goals faster.
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-10">
                        {features.map((feature) => (
                            <motion.div
                                key={feature.name}
                                className="relative"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <dt>
                                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </div>
        </motion.section>
    )
}
