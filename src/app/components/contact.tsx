"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { MapPin, Mail, Phone } from "lucide-react"

export default function Contact() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
            },
        },
    }

    return (
        <motion.section
            id="contact"
            className="py-16 "
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-medium text-gray-900 sm:text-4xl">Contact Us</h2>
                    <p className="mt-4 text-xl text-gray-600">Get in touch with us for any questions or inquiries</p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <motion.div className="bg-white overflow-hidden shadow rounded-lg" variants={itemVariants}>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <MapPin className="h-8 w-8 text-primary" />
                                <h3 className="ml-3 text-lg font-medium text-gray-900">Address</h3>
                            </div>
                            <p className="mt-2 text-base text-gray-500">
                                Ignatius Ajuru University of Education ICT Centre, Port Harcourt, Rivers State, Nigeria.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div className="bg-white overflow-hidden shadow rounded-lg" variants={itemVariants}>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <Mail className="h-8 w-8 text-primary" />
                                <h3 className="ml-3 text-lg font-medium text-gray-900">Email</h3>
                            </div>
                            <p className="mt-2 text-base text-gray-500">adeleempowermentfoundation@gmail.com</p>
                        </div>
                    </motion.div>

                    <motion.div className="bg-white overflow-hidden shadow rounded-lg" variants={itemVariants}>
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <Phone className="h-8 w-8 text-primary" />
                                <h3 className="ml-3 text-lg font-medium text-gray-900">Phone</h3>
                            </div>
                            <p className="mt-2 text-base text-gray-500">+234 813 303 9718</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}
