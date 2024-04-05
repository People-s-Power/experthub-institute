"use client"

import { Spin } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import router from 'next/router';
import React, { useState } from 'react';

const verify = () => {
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const user = useSearchParams().get("user")

  const submit = async () => {
    setLoading(true)
    axios.post(`https://shark-app-2-k9okk.ondigitalocean.app/auth/verify/${user}`, {
      verifyCode: code
    })
      .then(function (response) {
        console.log(response.data)
        setLoading(false)
        router.push(`/auth/survey?user=${user}`)

        // setSuccess(true)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      })
  }

  return (
    <main >
      <img src="/images/auth-bg.png" className='h-[100vh] w-full' alt="" />
      <section className='absolute top-32 left-0 right-0 mx-auto lg:w-[30%] w-[95%]'>
        <section className='rounded-md bg-white border border-[#FDC3327D] p-10 '>
          {success === false ? <div>
            <div className='text-center'>
              <img src="/images/verify.png" className='mx-auto' alt="" />
              <p className='font-bold my-3'>Verify your email</p>
              <p className='text-xs'>We have sent a six-digit code to your email address, enter it below to continue</p>
            </div>
            <div className='my-4'>
              <label className="text-xs my-1">Code</label>
              <input onChange={e => setCode(e.target.value)} type="number" className='border border-[#FDC33263] rounded-md p-2 w-full' placeholder='******' />
            </div>
            <button onClick={() => submit()} className='w-full bg-primary p-2 text-sm rounded-md'>{loading ? <Spin /> : "Verify"}</button>
          </div> : <div>
            <div className='text-center'>
              <img src="/images/done.png" className='mx-auto' alt="" />
              <p className='font-bold my-3'>Thank you!</p>
              <p className='text-xs'>we will review your application and contact you shortly.</p>
            </div>
            <Link href={"/auth/login"}><button className='w-full bg-primary p-2 text-sm rounded-md mt-10'>Done</button></Link>
          </div>}
        </section>
      </section>
    </main>
  );
};

export default verify;