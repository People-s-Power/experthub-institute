"use client"

import { CourseType } from '@/types/CourseType';
import { UserType } from '@/types/UserType';
import { notification } from 'antd';
import { closePaymentModal, useFlutterwave } from 'flutterwave-react-v3';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import apiService from "@/utils/apiService";

const Single = () => {
  const [course, setCourse] = useState(null)
  const [userDeets, setUserDeets] = useState(null)
  const page = usePathname()
  const user = useSearchParams().get("user")
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()
  const [active, setActive] = useState(0)

  const enroll = () => {
    try {
      apiService.post(`/courses/enroll/${course?._id}`, {
        id: userDeets?.id
      })
        .then(function (response) {
          // console.log(response.data)
          api.open({
            message: `Course Purchased for ${userDeets?.name}`
          });
          router.push('/')
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

  const getData = async () => {
    await apiService.get(`/courses/single-course${page}`)
      .then(function (response) {
        setCourse(response.data.course)
        console.log(response.data)
      })
  }

  const getUser = async () => {
    await apiService.get(`/user/profile/${user}`)
      .then(function (response) {
        setUserDeets(response.data.user)
        // console.log(response.data)m
      })
  }

  useEffect(() => {
    getData()
    getUser()
  }, [])


  const config = {
    public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
    tx_ref: Date.now(),
    amount: course?.fee,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: userDeets?.email,
      // phone_number: '070********',
      name: userDeets?.fullName,
    },
  };


  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className='lg:w-1/2 mx-auto p-4'>
      {contextHolder}
      <h1 className='lg:text-3xl text-xl'><span className='capitalize'>{userDeets?.fullName}</span> has asked you to purchase the course {course?.title} for them.</h1>
      <img className='my-3' src={course?.thumbnail} alt="" />
      <p>{course?.about}</p>
      {course?.benefits && <div className='my-6'>
        <p className='font-bold text-lg'>In this course you'll learn how to</p>
        <ol className='list-decimal grid grid-cols-2'>
          {course.benefits.map((single, index) => <li key={index} className='ml-4'>{single}</li>)}
        </ol>
      </div>}
      {course?.modules && <div>
        <div className='flex '>
          <p onClick={() => setActive(0)} className={active === 0 ? 'font-bold border-b py-1 border-primary cursor-pointer' : 'font-bold py-1 cursor-pointer'}>Course Modules</p>
          <p onClick={() => setActive(1)} className={active === 1 ? 'ml-4 font-bold border-b py-1 border-primary cursor-pointer' : 'font-bold py-1 ml-4 cursor-pointer'}>Course Descriptions</p>
        </div>
        {active === 0 ? <div>
          {course?.modules.map((module, index) => <div className='my-2'>
            <p className='font-medium my-1'>Module {index + 1}</p>
            <p>{module.title}</p>
          </div>)}
        </div> : <div>
          {course?.modules.map((module, index) => <div className='my-2'>
            <p className='font-medium my-1'>Module {index + 1}</p>
            <p>{module.description}</p>
          </div>)}
        </div>}
      </div>}
      <div className='flex p-3 justify-between   '>
        <Link href={'/'}>
          <button className='p-3 bg-[#D9D9D94D]'>Cancel</button>
        </Link>
        <button onClick={() => course?.fee === 0 ? enroll() : handleFlutterPayment({
          callback: (response) => {
            enroll()
            console.log(response);
            closePaymentModal() // this will close the modal programmatically
          },
          onClose: () => {
            console.log("closed")
          },
        })
        } className='bg-primary text-white p-3'>Porceed</button>
      </div>
    </div >
  );
};

export default Single;