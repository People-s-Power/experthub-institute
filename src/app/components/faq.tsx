"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "Are the courses worth paying that much for it?",
    answer:
      "<strong>YES</strong> <br /> When you pay for Our Course, Experthub will: <br /><ul><li>Provide comprehensive training programs that cover a wide spectrum of tech skills, ensuring that you receive a well-rounded education in your chosen field.</li><li>Provide insights, guidance, and practical expertise based on real world experience from experienced and knowledgeable instructors.</li><li>Highly increase your confidence level to undertake bolder projects in your industry and even in others.</li><li>Tailor their training programs to suit your individual learning needs ensuring that you receive a personalized education that matches your pace and style.</li><li>Offer career placement services, helping you secure employment or internships.</li><li>Teach you hands-on projects and exercises to reinforce your learning</li></ul>",
  },
  {
    question: "Can Experthub cover all my training?",
    answer:
      "<strong>YES</strong> <br /> Our Instructors are seasoned expert in their fields who have a track record of delivering high-quality educational content.",
  },
  {
    question: "How can I signup and get started?",
    answer:
      "To sign-up, click on the register button above and navigate to Register Now button to register either as an Applicant if you want to apply for any of our courses or to Register as a Tutor if you have the requisite qualification to be an instructor on any of our skilled areas.<br /><strong>OR </strong><br />Simply click on this <a href='/auth/signup'>link</a> to start your Registration immediately:",
  },
  {
    question: "What makes your courses different?",
    answer:
      "Our courses are designed by industry experts and focus on practical, hands-on learning. We also provide personalized mentorship and career support.",
  },
  {
    question: "How long does it take to complete a course?",
    answer: "Course duration varies, but most of our courses can be completed in 3-6 months with part-time study.",
  },
  {
    question: "Do you offer job placement assistance?",
    answer: "Yes, we provide career coaching, resume reviews, and connect our top students with our hiring partners.",
  },
  {
    question: "Are there any prerequisites for your courses?",
    answer:
      "Most of our beginner courses don't have prerequisites. For advanced courses, we recommend checking the course description for specific requirements.",
  },
  {
    question: "Do I get a certificate upon completion?",
    answer:
      "Yes, you will receive a certificate of completion for each course you successfully finish. These certificates can be shared on your LinkedIn profile or added to your resume to showcase your new skills.",
  },
  {
    question: "What if I'm not satisfied with a course?",
    answer:
      "We offer a 30-day money-back guarantee for most courses. If you're not satisfied with your learning experience, you can request a refund within 30 days of enrollment, no questions asked.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-8 sm:py-10 md:py-12 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-medium tracking-tighter text-center mb-8">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="py-4">
              <button
                className={`flex w-full items-center justify-between py-4 text-lg font-medium transition-all hover:underline ${openIndex === index && "pb-2"}`}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${openIndex === index && "rotate-180"}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="pb-4 pt-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
