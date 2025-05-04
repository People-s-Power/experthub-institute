"use client"

import { ArrowRight, Building2, Handshake, Users } from 'lucide-react'
import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'

const partners = [
    {
        title: "Funders",
        icon: Building2,
        description: "Support our mission through funding and resources"
    },
    {
        title: "Corporates",
        icon: Building2,
        description: "Partner with us for business collaboration"
    },
    {
        title: "Placement Organisations",
        icon: Users,
        description: "Provide opportunities for our participants"
    },
    {
        title: "Others",
        icon: Handshake,
        description: "Join us in other meaningful ways"
    }
]

export default function PartnerSection() {
    return (
        <>
            <section id="patners" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center mb-10">
                        <h3 className="text-2xl font-medium text-center">Improve Skills & Earn Through Our Partners</h3>
                    </div>
                    <div className="flex lg:w-1/2 mx-auto my-10 justify-between">
                        <div className="text-center">
                            <Image width={80} height={80} className="lg:w-20 w-10 object-cover lg:h-20 mx-auto" src="/images/expat.png" alt="ExpertHub LLC" />
                            <p className="lg:text-base text-xs font-medium mt-2">EXPERTHUB LLC</p>
                        </div>
                        <div className="text-center">
                            <Image width={80} height={80} className="lg:w-20 w-10 mx-auto" src="/images/peoples-pow.png" alt="Peoples Power" />
                            <p className="lg:text-base text-xs font-medium mt-2">PEOPLES POWER</p>
                        </div>
                        <div className="text-center">
                            <Image width={80} height={80} className="lg:w-20 w-10 mx-auto" src="/images/edf.png" alt="ED Foundation" />
                            <p className="lg:text-base text-xs font-medium mt-2">ED FOUNDATION</p>
                        </div>
                    </div>
                </div>
            </section>

            <section id='partner' className="relative overflow-hidden bg-[#2B5329] py-24 px-6 md:px-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }} />
                </div>

                <div className="relative max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Come partner with us
                        </h2>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                            Funders, Corporates, Placement Organisations & others looking to be part of the programme
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {partners.map((partner, index) => (
                            <motion.div
                                key={partner.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white hover:bg-white/20 transition-colors"
                            >
                                <partner.icon className="w-10 h-10 mb-4" />
                                <h3 className="text-xl font-semibold mb-2">{partner.title}</h3>
                                <p className="text-white/70">{partner.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-center"
                    >
                        <Link
                            href={"https://team.experthubllc.com/form/qnxyx7"}
                            className="bg-white inline-flex mx-auto w-fit items-center justify-center text-black py-2 px-8 hover:bg-white/90 font-semibold text-lg group"
                        >
                            PARTNER WITH US
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    )
}
