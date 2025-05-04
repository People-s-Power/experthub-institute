'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function CallToAction() {
    return (
        <motion.section
            id="cta"
            className="bg-yellow-600 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="lg:text-center"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to start learning?</span>
                        <span className="block">Sign up today and get your first course!</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-black">
                        Join thousands of learners who have already transformed their lives through our platform.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <div className="inline-flex rounded-md shadow">
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-indigo-50"
                            >
                                Get started
                            </Link>
                        </div>
                        <div className="ml-3 inline-flex">
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-primary"
                            >
                                Learn more
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    )
}
