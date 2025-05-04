"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SignUpComp from '@/components/SignUpComp';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<string>("");
  const searchParams = useSearchParams();
  const type = searchParams.get("role") as "student" | "tutor" | null;
  const router = useRouter()
  // Skip role selection if role is passed in URL
  useEffect(() => {
    if (type) {
      setRole(type);
      setStep(2);
    }
  }, [type]);
  useEffect(() => {
    if (step === 3) {
      setTimeout(() => {
        const id = localStorage.getItem("id")
        router.push(`/auth/verify?user=${id}`)
      })
    }
  }, [step]);
  const roleDescriptions = {
    student: {
      title: "Applicant",
      description: "Join as a learner to access courses, track your progress, and achieve your learning goals. Perfect for students and professionals looking to upskill."
    },
    tutor: {
      title: "Trainer",
      description: "Share your expertise by creating and teaching courses. Ideal for professionals, educators, and subject matter experts."
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <main className="relative h-screen w-full overflow-hidden">
      <img
        src="/images/auth-bg.png"
        className="absolute h-full w-full object-cover"
        alt="Background"
      />

      <section className="absolute inset-0 flex items-center justify-center p-4">
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-md border border-[#FDC3327D] shadow-lg overflow-hidden"
        >
          {/* Step indicator */}
          <div className="flex p-4 border-b border-gray-200">
            {[1, 2, 3].map((i) => (
              <React.Fragment key={i}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${step >= i ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  {i}
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-1 mt-3 mx-2 
                      ${step > i ? 'bg-primary' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold text-xl text-center mb-6">Join as a...</h3>

                  <div className="space-y-4">
                    {Object.entries(roleDescriptions).map(([key, { title, description }]) => (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-colors
                          ${role === key ? 'border-primary bg-primary/10' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => {
                          setRole(key as "student" | "tutor");
                          nextStep();
                        }}
                      >
                        <h4 className="font-semibold text-lg">{title}</h4>
                        <p className="text-sm text-gray-600 mt-2">{description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-bold text-xl text-center mb-6">
                    {role === 'student' ? 'Applicant' : 'Trainer'} Information
                  </h3>

                  <SignUpComp action={() => setStep(3)} contact={false} role={role} />

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Back
                    </button>
                    {
                      step <= 1 && <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                      >
                        Continue
                      </button>
                    }

                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Registration Complete!</h3>
                  <p className="text-gray-600 mb-6">
                    {role === 'student'
                      ? "You're now ready to start learning. Check your for a code email to verify your account."
                      : "Your application has been received. Check your email for a code  to verify your account."}
                  </p>

                  <button className="w-full px-4 py-2 bg-primary  rounded-md hover:bg-primary/90">
                    Redirecting...
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {step < 3 && (
            <div className="text-xs flex justify-center p-4 border-t border-gray-200">
              <p className="text-gray-600 mr-2">Already have an account?</p>
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          )}
        </motion.div>
      </section>
    </main>
  );
};

export default SignUp;