"use client"

import apiService from '@/utils/apiService';
import { Spin, notification } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const page = () => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()

  const reset = () => {
    if (email === "") {
      return
    }
    setLoading(true)
    apiService.put('/auth/forgot-passowrd', {
      email
    }).then(function (response) {
      console.log(response.data)
      api.open({
        message: response.data.message
      });
      router.push('/auth/reset-password')
      setLoading(false)

    })
      .catch(error => {
        setLoading(false)
        api.open({
          message: error.response.data.message
        });
      })
  }
  return (
    <main >
      {contextHolder}
      <img src="/images/auth-bg.png" className='h-[100vh] w-full' alt="" />
      <section className='absolute top-40 left-0 right-0 mx-auto lg:w-[30%] w-[95%]'>
        <section className='rounded-md bg-white border border-[#FDC3327D] p-6 '>
          <h3 className='font-bold text-base text-center'>Forgot Password</h3>
          <label htmlFor="email" className='font-medium'>Email</label>
          <div className='w-full my-2'>
            <input onChange={e => setEmail(e.target.value)} type="text" className='p-2 w-full border border-primary' />
          </div>
          <div className='my-2 text-xs'>
            <button onClick={() => reset()} className='w-full bg-primary p-2 rounded-sm font-medium'>{loading ? <Spin /> : "Send"}</button>
          </div>
          <div className='text-xs flex justify-center mt-2'>
            <p className='text-[#052126] mr-2'>Remember Password Now? </p>
            <Link href={"/auth/login"}><p className='text-[#346771]'>Sign In</p></Link>
          </div>
        </section>
      </section>
    </main>
  );
};

export default page;