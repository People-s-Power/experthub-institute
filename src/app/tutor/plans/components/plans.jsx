'use client'


import PaymentModal from '@/components/modals/PaymentModal';
import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';
import { notification } from 'antd';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { BsCheckCircleFill, BsX } from 'react-icons/bs';

export default function Plans() {
    const [isYearly, setIsYearly] = useState(false);
    const [userProfile, setUser] = useState();

    const user = useAppSelector((state) => state.value);
    const [api, contextHolder] = notification.useNotification();
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        plan: '',
        amount: '',
        planId: null
    })
    const getUser = () => {
        apiService.get(`user/profile/${user.id}`)
            .then(function (response) {
                setUser(response.data.user)
            })
    }
    const updateUserStatus = () => {
        try {
            apiService.post(`user/premium`, {
                id: user.id,
                ...paymentInfo,
                isYearly,
            })
                .then(function (response) {
                    console.log(response.data)
                    api.open({
                        message: 'Subscribed  Successfully'
                    });
                    router.push('/tutor')
                })
                .catch(err => {
                    api.open({
                        message: err.response.data.message
                    });
                    // console.log(err.response.data.message)
                })
        } catch (e) {
            // console.log(e.response.data.message)
        }

    }
    const payWithWallet = () => {
        apiService.post(`transactions/pay-with`, {
            amount: paymentInfo.amount,
            userId: user.id
        })
            .then(function (response) {
                console.log(response.data)
                api.open({
                    message: response.data.message
                });
                if (response.status == 200) {
                    updateUserStatus()
                    setOpen(false)
                }
            })
            .catch(err => {
                setOpen(false)
                console.log(err)
                api.open({
                    message: err.response.data,
                    placement: 'top'
                });
            })
    }


    const config = {
        public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
        tx_ref: Date.now(),
        amount: parseFloat(paymentInfo.amount),
        currency: 'NGN',
        payment_options: "card",
        payment_plan: paymentInfo.planId,
        customer: {
            email: user.email,
            name: user.fullName,
        },
        customizations: {
            title: `Payment for ${paymentInfo.plan}`,
            description: 'Premuim subscription',
            logo: 'https://trainings.experthubllc.com/images/logo.png',
        },
    };
    const plans = [
        {
            name: "Basic",
            price: { monthly: "Free", yearly: "Free" },
            description: "Perfect for individual users who are just starting",
            features: [
                { feature: "Can create up to 5 Courses and Events", available: true },
                { feature: "Free PDF, Image, and Video Course Upload", available: true },
                { feature: "Can create Seminars, Conferences, and Workshops", available: true },
                { feature: "Can Create Live Streaming Courses", available: false },
                { feature: "Access to Email Sending Tools", available: false },
                { feature: "Access to Staff Support", available: false },
                { feature: "Access to AI Tools for Course Creation", available: false },
            ],
            buttonLabel: null,
            isPopular: false,
        },
        {
            name: "Standard",
            price: { monthly: { amount: "8000", payment_id: "133951" }, yearly: { amount: "80000", payment_id: "133952" } },
            description: "Perfect for small businesses",
            features: [
                { feature: "Can create up to 20 Courses and Events", available: true },
                { feature: "Free PDF, Image, and Video Course Upload", available: true },
                { feature: "Can create Seminars, Conferences, and Workshops", available: true },
                { feature: "Can Create Live Streaming Courses", available: true },
                { feature: "Access to Email Sending Tools", available: true },
                { feature: "Add Team Member", available: true },
                { feature: "Access to Staff Support", available: false },

                { feature: "Access to AI Tools for Course Creation", available: false },
            ],
            buttonLabel: "Go Premium",
            isPopular: true,
        },
        {
            name: "Enterprise",
            price: { monthly: { amount: "15000", payment_id: "133953" }, yearly: { amount: "150000", payment_id: "133954" } },
            description: "Perfect for big businesses",
            features: [
                { feature: "Can create Unlimited Courses and Events", available: true },
                { feature: "Free PDF, Image, and Video Course Upload", available: true },
                { feature: "Can create Seminars, Conferences, and Workshops", available: true },
                { feature: "Can Create Live Streaming Courses", available: true },
                { feature: "Access to Email Sending Tools", available: true },
                { feature: "Access to Staff Support", available: true },
                { feature: "Add Team Member", available: true },
                { feature: "Access to AI Tools for Course Creation", available: true },
            ],
            buttonLabel: "Go Premium",
            isPopular: false,
        },
    ];

    const handleFlutterPayment = useFlutterwave(config);

    useEffect(() => {
        getUser()
        // updateUserStatus()
    }, [])
    return (
        <>
            <div className="flex flex-col items-center mt-9">
                <h1 className="text-2xl font-semibold uppercase mb-2">Premium Plan</h1>
                <p className="text-gray-600 text-center mx-auto max-w-4xl">
                    Activate your free 5-day trial. No Contracts. You can always change your plan or cancel anytime with one click if the premium service isn't right for you.
                </p>
                <p className='mt-4'>Save with annual plans.</p>
                <div className="flex items-center justify-center gap-4 mt-4 mb-8">
                    <span className={isYearly ? "text-gray-400" : "font-bold"}>Monthly</span>
                    <div onClick={() => setIsYearly(!isYearly)} className={` px-1 rounded-[20px] w-[60px] ${isYearly ? 'text-right' : ''}  items-center justify-center bg-primary`}>
                        <span className={`inline-block w-[15px] h-[15px] -mt-3 bg-white rounded-full `}></span>
                    </div>
                    <span className={isYearly ? "font-bold" : "text-gray-400"}>Yearly</span>
                    <span className="text-gray-500 text-sm">(2 months free)</span>
                </div>
                <div className="flex flex-col md:flex-row gap-6 justify-center mt-14">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={` p-6 rounded-lg  ${plan.isPopular ? '-mt-5 shadow-[0px_0px_5px_2px_rgb(0,0,0,0.7)]' : "shadow-[0px_0px_4px_1px_rgb(0,0,0,0.5)]"}  shadow-[0px_0px_4px_1px_rgb(0,0,0,0.5)]
                                }`}
                            style={{ maxWidth: "400px" }}
                        >
                            {(plan.isPopular && userProfile?.premiumPlan !== plan.name.toLowerCase()) && <span className="text-[18px] text-red-400 capitalize w-full text-center font-semibold flex justify-center">Most Popular</span>}
                            <h3 className={`text-xl font-medium flex items-center gap-3  uppercase mb-2 `}>
                                {plan.name} {userProfile?.premiumPlan === plan.name.toLowerCase() && <span className='capitalize text-[15px] border-2 px-2 rounded-lg border-primary'>Your Current Plan</span>}
                            </h3>
                            <p className="text-gray-600">{plan.description}</p>
                            <p className="text-2xl font-bold mt-4">

                                {
                                    plan.price.yearly !== 'Free' || plan.price.monthly !== 'Free' ? <>

                                        {isYearly ? new Intl.NumberFormat("en-NG", {
                                            style: "currency",
                                            currency: "NGN",
                                            minimumFractionDigits: 0

                                        }).format(parseFloat(plan.price.yearly.amount)) : new Intl.NumberFormat("en-NG", {
                                            style: "currency",
                                            currency: "NGN",
                                            minimumFractionDigits: 0

                                        }).format(parseFloat(plan.price.monthly.amount))
                                        }

                                        {isYearly ? "/year" : "/month"}
                                    </> : "Free"

                                }
                            </p>
                            <ul className="mt-4 space-y-2">
                                {plan.features.map((item, idx) => (
                                    <li key={idx} className="flex items-center">
                                        <span className={`mr-2 ${item.available ? "text-green-500" : "text-red-500"}`}>
                                            {item.available ? <span className='text-primary text-[20px]'><BsCheckCircleFill /></span> : <span className='w-[20px] h-[20px] inline-flex items-center justify-center text-[17px] border border-black rounded-full'><BsX /> </span>}
                                        </span>
                                        {item.feature}
                                    </li>
                                ))}
                            </ul>
                            {plan.buttonLabel && userProfile?.premiumPlan !== plan.name.toLowerCase() && (
                                <div className='text-center w-full'>
                                    <button onClick={() => {
                                        setPaymentInfo({ amount: isYearly ? plan.price.yearly.amount : plan.price.monthly.amount, plan: plan.name, planId: isYearly ? plan.price.yearly.payment_id : plan.price.monthly.payment_id })
                                        setOpen(true)
                                    }} className="bg-yellow-500 text-black font-semibold uppercase py-2 px-4 rounded-lg shadow-[0px_4px_2px_-1px_rgb(0,0,0,0.5)] mt-9 mx-auto hover:shadow-none duration-300">
                                        {plan.buttonLabel}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>


            <PaymentModal isOpen={open} onClose={() => setOpen(false)} wallet={() => payWithWallet()} card={() => handleFlutterPayment({
                callback: (response) => {
                    updateUserStatus()
                    setOpen(false)
                    console.log(response)
                    closePaymentModal()
                },
                onClose: () => {
                    console.log("closed")
                },
            })} />
        </>



    )
}
