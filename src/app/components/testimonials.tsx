"use client"

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/autoplay'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { motion } from "framer-motion"
import { useMemo } from "react"

const baseTestimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "The courses on this platform have been instrumental in advancing my career.",
  },
  {
    name: "Michael Chen",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "I've learned more here than in years of traditional education. Projects are gold.",
  },
  {
    name: "Emily Rodriguez",
    role: "Graphic Designer",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    quote: "These courses helped me stay current with design trends. Huge boost to my freelance career.",
  },
]

// Generate extra testimonials
const generateFakeTestimonials = (count = 10) => {
  const names = [
    "Alex", "Jamie", "Taylor", "Morgan", "Casey", "Jordan", "Avery", "Cameron",
    "Riley", "Parker", "Quinn", "Reese", "Drew", "Skyler", "Sawyer", "Emery",
    "Blake", "Harper", "Sage", "Rowan"
  ]

  const roles = [
    "Web Developer",
    "Data Analyst",
    "UX Designer",
    "Product Manager",
    "QA Engineer",
    "Content Writer",
    "High School Student",
    "College Researcher",
    "Freelance Illustrator",
    "Marketing Specialist",
    "Teacher's Assistant",
    "Customer Support",
    "Project Coordinator",
    "Copywriter",
    "Social Media Manager"
  ]

  const quotes = [
    "This platform changed how I learn by making complex topics easy and enjoyable to understand. The hands-on projects really helped me build real-world skills.",
    "The lessons are so practical and easy to follow, even for someone without a technical background like me. I’ve gained confidence in both my work and communication skills.",
    "Great support and community. The instructors are always ready to help, and connecting with other learners has been motivating and inspiring.",
    "I landed a job thanks to the skills I gained here. The detailed coursework and real-life examples gave me the edge I needed in interviews.",
    "Totally worth it! The curriculum is thorough, and the flexibility to learn at my own pace meant I could balance this with my busy schedule.",
    "As a writer, I found the creative courses extremely helpful in expanding my storytelling techniques and engaging readers effectively.",
    "Balancing schoolwork with learning new skills was a challenge, but this platform made it manageable and even fun with its interactive style.",
    "The design tutorials helped me build a strong portfolio, which was crucial in landing freelance gigs and expanding my client base.",
    "I appreciated how the platform supports various fields, from marketing to illustration, giving me tools to enhance my career in social media management.",
    "The clear explanations and diverse content helped me pivot my career from customer support to project coordination successfully.",
  ]


  return Array.from({ length: count }, () => ({
    name: names[Math.floor(Math.random() * names.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "men" : "women"}/${Math.floor(Math.random() * 90)}.jpg`,
    quote: quotes[Math.floor(Math.random() * quotes.length)],
  }))
}

export default function Testimonials() {
  const testimonials = useMemo(() => [...baseTestimonials, ...generateFakeTestimonials(12)], [])

  const settings = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 }
      }
    ]
  }

  return (
    <motion.section
      id="testimonials"
      className="py-16 bg-[#f9f9f9]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 overflow-x-hidden">
        <div className="text-center mb-10">
          <h2 className="text-base text-yellow-600 font-medium uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl">
            What our students say
          </p>
          <p className="mt-4 text-lg text-gray-600">
            Real stories from our global learner community
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={3}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{
            clickable: true,
            bulletClass:
              "swiper-pagination-bullet bg-gray-300 opacity-70 hover:opacity-100",
            bulletActiveClass: "swiper-pagination-bullet-active bg-yellow-500",
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 16 },
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
          }}
          className="relative !overflow-visible"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index} className=" py-10">
              <motion.div
                className="bg-white rounded-xl shadow-xl p-6 h-[240px] flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <img
                    className="h-14 w-14 rounded-full mr-4 object-cover border-2 border-yellow-400"
                    src={testimonial.image}
                    alt={testimonial.name}
                    loading="lazy"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </motion.div>
            </SwiperSlide>
          ))}

          {/* Navigation buttons */}
          <div className="swiper-button-prev absolute duration-300 top-1/2 -left-4 md:-left-10  -translate-y-1/2 z-50 cursor-pointer rounded-full bg-yellow-500 p-2 text-white shadow-lg hover:bg-yellow-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>

          <div className="swiper-button-next absolute top-1/2 -right-4 md:-right-10 duration-300 -translate-y-1/2 z-20 cursor-pointer rounded-full bg-yellow-500 p-2 text-white shadow-lg hover:bg-yellow-300 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Swiper>

      </div>
    </motion.section>
  )
}
