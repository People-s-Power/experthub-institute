"use client"

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SignUpComp from '@/components/SignUpComp';
import { useSearchParams } from 'next/navigation';

const signup = () => {
  const [role, setRole] = useState("student")

  const searchParams = useSearchParams();
  const type = searchParams.get("role");
  useEffect(() => {
    if (type) {
      setRole(type)

    }
  }, [])


  return (
    <main >
      <img src="/images/auth-bg.png" className='h-[100vh] w-full' alt="" />
      <section className='absolute top-10 left-0 right-0 mx-auto lg:w-[30%] w-[95%]'>
        <section className='rounded-md bg-white border border-[#FDC3327D] p-6 '>
          <h3 className='font-bold text-base text-center'>Sign up</h3>
          <div className='flex my-3 justify-evenly'>
            {!type &&
              <button onClick={() => setRole("student")} className={role === "student" ? 'bg-primary text-sm p-1 px-6 rounded-sm' : "bg-gray p-1 px-6 text-sm rounded-sm"}>Applicant</button>
            }
            <button onClick={() => setRole("tutor")} className={role === "tutor" ? 'bg-primary p-1 px-6 text-sm rounded-sm' : "bg-gray p-1 px-6 text-sm rounded-sm"}>Trainer</button>
          </div>

          {/* {
          role === "applicant" ? */}
          <SignUpComp contact={false} role={role} />
          {/* : role === "trainer" ? <div></div> : null
        } */}
        </section>
        <div className='text-xs flex justify-center mt-2'>
          <p className='text-[#052126] mr-2'>Do you have an account?</p>
          <Link href={"/auth/login"}><p className='text-[#346771]'>Login</p></Link>
        </div>
      </section>
    </main>
  );
};

export default signup;