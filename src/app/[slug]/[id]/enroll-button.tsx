'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CourseTypeSingle, EventTypeSingle } from '@/types/CourseType'
import { useAppSelector } from '@/store/hooks'
import apiService from '@/utils/apiService'
import { notification } from 'antd'
import PaymentModal from '../../../components/modals/PaymentModal'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface EnrollButtonProps {
    type: 'course' | 'event'
    data: CourseTypeSingle | EventTypeSingle
    className?: string
}

export default function EnrollButton({ type, data, className }: EnrollButtonProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [api, contextHolder] = notification.useNotification();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = useAppSelector((state) => state.value);
    const enroll = () => {
        try {
            setLoading(true)
            apiService.post(`courses/enroll/${data._id}`, {
                id: user.id
            })
                .then(function (response) {
                    // console.log(response.data)
                    api.open({
                        message: 'Enrolled Successfully'
                    });
                    router.push("/applicant")
                })
                .catch(err => {
                    api.open({
                        message: err.response.data.message
                    });
                    // console.log(err.response.data.message)
                }).finally(() => {
                    setLoading(false)

                })
        } catch (e) {
            // console.log(e.response.data.message)
        }
    }
    const enrollEvent = () => {
        try {
            setLoading(true)

            apiService.put(`events/enroll/${data._id}`, {
                id: user.id
            })
                .then(function (response) {
                    console.log(response)
                    api.open({
                        message: response.data.message,
                    });
                    router.push("/applicant")

                })
                .catch(err => {
                    api.open({
                        message: err.response.data.message
                    });
                    console.log(err.response.data.message)
                }).finally(() => {
                    setLoading(false)

                })
        } catch (e) {
            // console.log(e.response.data.message)
        }
    }
    const checkType = () => {
        if (type === "event") {
            enrollEvent()
        } else (
            enroll()

        )
    }

    const config = {
        public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
        tx_ref: Date.now().toString(),
        amount: data.fee,
        currency: 'NGN',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
            email: user.email,
            phone_number: '070********',
            name: user.fullName as string,
        },
        customizations: {
            title: "Course Payment",
            description: "",
            logo: ""


        }
    };

    const handleFlutterPayment = useFlutterwave(config);
    const payWithWallet = () => {
        apiService.post(`transactions/pay-with`, {
            amount: data.fee,
            userId: user.id
        })
            .then(function (response) {
                console.log(response.data)
                api.open({
                    message: response.data.message
                });
                if (response.status == 200) {
                    checkType()
                    setIsModalOpen(false)
                }
            })
            .catch(err => {
                setIsModalOpen(false)
                console.log(err)
                // handleClick()
                api.open({
                    message: err.response.data,
                    placement: 'top'
                });
            })
    }
    return (
        <>
            <button
                onClick={() => {
                    if (user.id) {
                        parseInt(data.fee.toString()) === 0 ? checkType() : setIsModalOpen(true)
                    } else {
                        router.push(`/auth/signup?enroll=${data._id}`)
                    }
                }}
                disabled={loading}
                className={className}
            >
                {loading ? 'Processing...' : data.fee > 0
                    ? `Enroll for $${data.fee}`
                    : type === 'course' ? 'Enroll for Free' : 'Register Now'
                }
            </button>
            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                wallet={() => payWithWallet()}
                card={() => handleFlutterPayment({
                    callback: (response) => {
                        checkType()
                        setIsModalOpen(false)
                        closePaymentModal()
                    },
                    onClose: () => { },
                })}
            />
        </>

    )
}

