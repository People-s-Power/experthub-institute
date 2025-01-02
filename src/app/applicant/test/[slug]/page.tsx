"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import { AssesmentElement, AssesmentType } from "@/types/AssesmentType";
import apiService from "@/utils/apiService";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SingleAssesment: React.FC = () => {
  const pathname = usePathname();
  const [assesment, setAssesment] = useState<AssesmentType | null>(null);
  const user = useAppSelector((state) => state.value);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const router = useRouter()
  const searchParams = useSearchParams();
  const type = searchParams.get("type"); // Access query parameter "name"
  const [answers, setAnswers] = useState<any>([])

  // Fetch Assessment
  const getAssesment = async () => {
    try {
      const response = await apiService.get(
        `assessment/single/${pathname.slice(16)}`
      );
      const fetchedAssesment = response.data.myAssesment[0];
      setAssesment(fetchedAssesment);
      fetchedAssesment.assesment.map(() => setAnswers([...answers, { answer: "" }]))
      setSelectedAnswers(new Array(fetchedAssesment.assesment.length).fill(-1)); // Initialize answers
    } catch (error) {
      console.error("Error fetching assessment:", error);
    }
  };

  const handleInputChange = (index: number, field: string, value: string | number) => {
    const updatedObjects = [...answers];
    updatedObjects[index] = { ...updatedObjects[index], [field]: value };
    setAnswers(updatedObjects);
  };

  // Handle Option Selection
  const handleSelect = (questionIndex: number, answerIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(updatedAnswers);
  };

  // Calculate Grade
  const calculateGrade = (): number => {
    if (!assesment) return 0;
    return assesment.assesment.reduce((grade: any, question: any, index: number) => {
      return grade + (selectedAnswers[index] === question.correctAnswerIndex ? 1 : 0);
    }, 0);
  };

  // Check Eligibility for Certificate
  const isEligibleForCertificate = (): boolean => {
    if (!assesment) return false;
    const totalScore = calculateGrade();
    const totalQuestions = assesment.assesment.length;
    const percentage = (totalScore / totalQuestions) * 100;
    return percentage >= 50 || (totalScore === 1 && totalQuestions === 1);
  };

  // Handle Form Submission
  const handleSubmit = () => {
    if (!assesment) return;
    if (selectedAnswers.includes(-1)) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setShowGradeModal(true);
  };

  const send = async () => {
    try {
      await apiService.post(`assessment/submit-assessment/${pathname.slice(16)}`, {
        studentId: user.id,
        answers
      });
      alert("Assesment submitted!");
      router.back()
    } catch (error) {
      console.error("Error submitting", error);
    }
  }

  // Claim Certificate
  const claimCertificate = async () => {
    if (!assesment) return;
    try {
      await apiService.post("certificate/claim", {
        user: user.id,
        title: assesment.title,
        tutor: assesment.tutor,
      });
      setShowGradeModal(false)
      alert("Certificate claimed successfully!");
      router.back()
    } catch (error) {
      setShowGradeModal(false)
      console.error("Error claiming certificate:", error);
    }
  };

  useEffect(() => {
    getAssesment();
  }, []);

  return (
    <DashboardLayout>
      <div>
        <div className="border-b p-4 border-[#1E1E1E38]">
          <p className="text-lg">Welcome</p>
          <p className="font-medium text-lg capitalize">{user.fullName}</p>
        </div>
        <div className="p-4">
          <p>
            Confirm Your Skill & Technical Level (
            {assesment?.title || "Loading..."})
          </p>
          <p>Answer all questions in order.</p>
          {type === 'theory' ? assesment?.assesment.map((question: any, index: any) => (<div key={index} className="bg-[#FFFFFFCC] p-4 my-3 rounded-md"
          >
            <div className="flex">
              <img src="/images/icons/heroicons_list-bullet.svg" alt="" />
              <p className="ml-2">Question {index + 1}</p>
            </div>
            <input
              value={question.question}
              disabled
              type="text"
              className="p-2 bg-[#D9D9D94D] my-3 w-full"
            />

            <textarea onChange={(e) => handleInputChange(index, "answer", e.target.value)} placeholder="Enter your response here" className="p-2 bg-[#D9D9D94D] my-3 w-full h-16"></textarea>

          </div>)) : assesment?.assesment.map((question: any, questionIndex: any) => (
            <div
              key={questionIndex}
              className="bg-[#FFFFFFCC] p-4 my-3 rounded-md"
            >
              <div className="flex">
                <img src="/images/icons/heroicons_list-bullet.svg" alt="" />
                <p className="ml-2">Question {questionIndex + 1}</p>
              </div>
              <input
                value={question.question}
                disabled
                type="text"
                className="p-2 bg-[#D9D9D94D] my-3 w-full"
              />
              {["A", "B", "C"].map((option, optionIndex) => (
                <div key={optionIndex} className="flex relative">
                  <p className="mx-2 my-auto">{option}</p>
                  <input
                    value={question[`answer${option}` as keyof AssesmentElement]}
                    disabled
                    type="text"
                    className="p-2 bg-[#D9D9D94D] my-3 w-full"
                  />
                  <img
                    src={
                      selectedAnswers[questionIndex] === optionIndex
                        ? "/images/checked.png"
                        : "/images/icons/game-icons_check-mark.svg"
                    }
                    onClick={() => handleSelect(questionIndex, optionIndex)}
                    className="absolute right-4 top-5 cursor-pointer w-6"
                    alt=""
                  />
                </div>
              ))}
            </div>
          ))}

          {type === 'theory' ?
            <button onClick={() => send()} className="p-2 px-10 bg-[#FDC332]">
              Submit
            </button> : <button onClick={handleSubmit} className="p-2 px-10 bg-[#FDC332]">
              Submit
            </button>}
        </div>
        {showGradeModal && (
          <div>
            <div className="fixed bg-black opacity-50 top-0 left-0 w-full h-full z-10"></div>
            <div className="fixed top-10 left-0 right-0 mx-auto w-11/12 lg:w-1/2 bg-white rounded-md p-6 z-20">
              <div className="flex justify-between">
                <p className="text-lg font-medium">Assessment Grade</p>
                <img
                  src="/images/icons/material-symbols_cancel-outline.svg"
                  onClick={() => setShowGradeModal(false)}
                  className="w-6 h-6 cursor-pointer"
                  alt="Close"
                />
              </div>
              <div className="text-center mt-4">
                <h1 className="text-2xl capitalize">
                  Congratulations {user.fullName}!
                </h1>
                <p>
                  {isEligibleForCertificate()
                    ? "You have successfully passed the assessment and can claim your certificate."
                    : "You scored below average. Please retake the test to qualify for a certificate."}
                </p>
              </div>
              <div className="flex justify-center mt-6">
                {isEligibleForCertificate() && (
                  <button
                    onClick={claimCertificate}
                    className="p-2 px-6 bg-green-500 text-white rounded-md mr-4"
                  >
                    Claim Certificate
                  </button>
                )}
                <button
                  onClick={() => { router.back() }}
                  className="p-2 px-6 bg-primary text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SingleAssesment;
