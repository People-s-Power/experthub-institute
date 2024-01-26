"use client"

import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';
import React, { useEffect } from 'react';

const profile = () => {

  const getUser = () => {
    axios.get('https://shark-app-2-k9okk.ondigitalocean.app/user/profile')
      .then(function (response) {
        // setReccomended(response.data.courses)
        console.log(response.data)
      })
  }

  useEffect(() => {
    getUser()
  })
  return (
    <DashboardLayout>
      <section className='flex justify-evenly'>
        <div className='w-[25%] mt-4'>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-3 text-center rounded-md'>
            <p className='font-medium text-lg'>Personal Details</p>
            <img src="/images/user.png" className='w-20 h-20 mx-auto my-3' alt="" />
            <p className='font-medium'>Adams John</p>
            <p className='text-xs'>Ayoolajanet12@gmail.com</p>
            <button className='bg-primary p-2 px-6 my-4 font-medium'>Edit profile</button>
          </div>
          <div className='my-4 text-center p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
            <p className='font-medium text-sm'>Highlights</p>
          </div>
          <div className='my-4 p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Phone Number</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="number" />
            </div>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Gender</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
            </div>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Age</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="number" />
            </div>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Country of Residence</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
            </div>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>State of Residence</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
            </div>
            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Skill Level</label>
              <input className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
            </div>
            <div className='text-center'><button className='bg-primary p-2 px-6 my-4 font-medium'>Edit highlights</button></div>
          </div>
        </div>
        <div className='mt-4 w-[65%]'>
          <p className='text-xl font-medium my-3'>Courses</p>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-3 rounded-md'>
            <p className='text-sm my-3'>Selected courses</p>
            <div className='flex justify-between border p-3 my-3 w-[80%] rounded-md border-[#1E1E1E75]'>
              <div className='flex '>
                <img className='w-32 rounded-md' src="/images/card.png" alt="" />
                <div className='mx-4'>
                  <p className='text-primary text-sm'>UI Design . <span className='text-black'> Evans D</span></p>
                  <p className='font-medium'>Get Started with prototyping</p>
                  <p className='text-sm'>Nov 17 2023</p>
                </div>
              </div>
              <button className='p-2 bg-primary my-auto rounded-sm'>In progress</button>
            </div>
          </div>
          <p className='text-xl font-medium my-4'>Employment Status</p>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-6 rounded-md'>
            <div className='flex justify-between'>
              <div className='w-[80%]'>
                <p className='font-medium my-3'>Your employment status</p>
                <p className='text-sm'>Add your past experience here. If you’re just starting out,
                  you can add internships or unemployed</p>
              </div>
              <div className=''>
                <img src="/images/icons/iconamoon_edit-bold.png" alt="" />
              </div>
            </div>
            <div className='border-t mt-4 border-[#1E1E1E4F]'>
              <p className='my-3 font-medium'>Employed</p>
              <div className='flex justify-between'>
                <div className='flex'>
                  <img className='w-12 mr-4 h-10' src="/images/peoples-pow.png" alt="" />
                  <div>
                    <p className='text-base font-medium'>UI UX Designer</p>
                    <p className='text-xs my-1'>Peoples power</p>
                    <p className='text-xs'>Oct 2020 - Dec 2020 - 3 months</p>
                  </div>
                </div>
                <div className='my-autp'>
                  <button className='font-bold p-3 border border-[#1E1E1E] rounded-md px-10'>+ Employment Status</button>
                </div>
              </div>
            </div>
          </div>

          <p className='text-xl font-medium my-4'>Education Level</p>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-6 rounded-md'>
            <div className='flex justify-between'>
              <div className='w-[80%]'>
                <p className='font-medium my-3'>Credentials</p>
                <p className='text-sm'>Add your school experience here. If you’re just starting out,
                  you can add certificate gotten</p>
              </div>
              <div className=''>
                <img src="/images/icons/iconamoon_edit-bold.png" alt="" />
              </div>
            </div>
            <div className='border-t mt-4 border-[#1E1E1E4F]'>
              {/* <p className='my-3 font-medium'>Employed</p> */}
              <div className='flex justify-between'>
                <div className='flex'>
                  <img className='w-12 mr-4 h-10' src="/images/peoples-pow.png" alt="" />
                  <div>
                    <p className='text-base font-medium'>Bachelors Degree</p>
                    <p className='text-xs my-1'>Rivers State University</p>
                    <p className='text-xs'>Oct 2020 - Dec 2020</p>
                  </div>
                </div>
                <div className='my-autp'>
                  <button className='font-bold p-3 border border-[#1E1E1E] rounded-md px-10'>+ Education Level</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>

  );
};

export default profile;