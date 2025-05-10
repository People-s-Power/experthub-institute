"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { CourseTypeSingle, EventTypeSingle } from "@/types/course-type"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import apiService from "@/utils/apiService"
import { notification } from "antd"
import PaymentModal from "@/components/modals/PaymentModal"
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3"
import { formatToNaira } from "@/lib/utils"
import SignUpComp from "@/components/SignUpComp"
import { jwtDecode } from "jwt-decode"
import { setUser } from "@/store/slices/userSlice"
// import Verify from "@/app/auth/verify/page"
interface EnrollButtonProps {
  type: "course" | "event"
  data: CourseTypeSingle | EventTypeSingle
  className?: string
  id?: string,
  buttonText?: string
}

export default function EnrollButton({ type, data, className, buttonText, id }: EnrollButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [api, contextHolder] = notification.useNotification()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  // const [showVerify, setShowVerify] = useState(false)
  const searchParams = useSearchParams()
  const user = useAppSelector((state) => state.value)
  const dispatch = useAppDispatch()

  const enroll = () => {
    try {
      setLoading(true)
      apiService
        .post(`courses/enroll/${data._id}`, { id: user.id })
        .then((response) => {
          api.open({ message: "Enrolled Successfully" })
          router.push("/applicant")
        })
        .catch((err) => {
          api.open({ message: err.response.data.message })
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (e) {
      // Error handling
    }
  }

  const enrollEvent = () => {
    try {
      setLoading(true)
      apiService
        .put(`events/enroll/${data._id}`, { id: user.id })
        .then((response) => {
          api.open({ message: response.data.message })
          router.push("/applicant")
        })
        .catch((err) => {
          api.open({ message: err.response.data.message })
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (e) {
      // Error handling
    }
  }

  const checkType = () => {
    if (type === "event") {
      enrollEvent()
    } else {
      enroll()
    }
  }

  const config = {
    public_key: "FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X",
    tx_ref: Date.now().toString(),
    amount: data.fee,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email,
      phone_number: "070********",
      name: user.fullName as string,
    },
    customizations: {
      title: "Course Payment",
      description: "",
      logo: "",
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  const payWithWallet = () => {
    apiService
      .post(`transactions/pay-with`, {
        amount: data.fee,
        userId: user.id,
      })
      .then((response) => {
        api.open({ message: response.data.message })
        if (response.status === 200) {
          checkType()
          setIsModalOpen(false)
        }
      })
      .catch((err) => {
        setIsModalOpen(false)
        api.open({
          message: err.response.data,
          placement: "top",
        })
      })
  }
  useEffect(() => {
    handleGoogleLink()
  }, [])

  const handleGoogleLink = () => {
    // Handle auth redirect with JWT data
    const encodedData = searchParams.get("data")

    if (encodedData) {
      try {
        const decoded: any = jwtDecode(encodedData)

        if (decoded) {
          dispatch(
            setUser({
              ...decoded.user,
              accessToken: decoded.accessToken,
            }),
          )
          api.open({
            message: "Login  successfully, Continue payment",
            type: "success",
          })
          // Clear the URL params without refreshing
          const newUrl = window.location.pathname

          window.history.replaceState({}, "", newUrl)
          const storedId = localStorage.getItem("enrollButtonId")
          if (storedId === id) {
            setIsModalOpen(true)
            localStorage.removeItem("enrollButtonId")
          }
        }
      } catch (error) {
        console.error("Invalid user data", error)
      }
    }
  }
  return (
    <>
      {contextHolder}
      <button
        id={id}
        onClick={() => {
          if (user.id) {
            Number.parseInt(data.fee.toString()) === 0 ? checkType() : setIsModalOpen(true)
          } else {
            localStorage.setItem("enrollButtonId", id || "")
            setShowSignUp(true)
          }
        }}
        disabled={loading || ((data as CourseTypeSingle).instructorId === user.id) || data.enrolledStudents?.includes(user.id) || Boolean(data.enrolledStudents?.find(stud => stud?._id === user.id))}
        className={`${className} disabled:cursor-not-allowed  disabled:opacity-70`}
      >
        {loading
          ? "Processing..."
          : data.fee > 0
            ? buttonText || `Enroll for ${formatToNaira(data.fee)}`
            : type === "course"
              ? buttonText || "Enroll for Free"
              : "Register Now"}
      </button>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={() => payWithWallet()}
        card={() =>
          handleFlutterPayment({
            callback: (response) => {
              checkType()
              setIsModalOpen(false)
              closePaymentModal()
            },
            onClose: () => { },
          })
        }
      />
      {/* {
        showVerify && <div className="fixed text-left z-50 top-0 left-0 bg-black/80 h-screen w-full flex items-center justify-center">
          <Verify onClose={() => setIsModalOpen(true)} hideBg={true} />
        </div>
      } */}

      {
        showSignUp && <SignUpComp role="student" action={() => setIsModalOpen(true)} onClose={() => { setShowSignUp(false); }} className="fixed text-left z-50 top-0 left-0 bg-black/80 h-screen w-full flex items-center justify-center text-black" innerClassName="bg-white p-8 w-full max-w-[440px]" />
      }

    </>
  )
}
