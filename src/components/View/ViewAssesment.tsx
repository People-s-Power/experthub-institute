'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'
import apiService from '@/utils/apiService';
import Scoring from '../modals/Scoring';

const ViewAssesment = () => {
  const page = useSearchParams().get("page")
  const [data, setData] = useState<any>()
  const [open, setOpen] = useState(false)

  const getAssesment = async () => {
    await apiService.get(`assessment/single/${page}`)
      .then(function (response) {
        console.log(response.data.myAssesment[0])
        setData(response.data.myAssesment[0])
      })
  }
  useEffect(() => {
    if (page !== null) {
      getAssesment()
    }
  }, [open])

  return (
    <div className='px-4'>
      <h1 className='font-bold text-xl'>Responses</h1>
      <p className='text-lg mt-3'><strong>Test:</strong> {data?.title}</p>
      <div className='lg:grid grid-cols-3 gap-4 mt-6'>
        {data?.responses.map((response: any, index: any) => <div onClick={() => setOpen(true)} key={index} className='p-3 cursor-pointer shadow-md rounded-md w-full'>
          <div className='flex'>
            <img className='rounded-full w-16 h-16' src={response.student.profilePicture} alt="" />
            <div className='my-auto ml-4'>
              <p className='capitalize text-xl'>{response.student.fullname}</p>
              {response.score && <p>Score: {response.score}</p>}
            </div>
          </div>
          <Scoring open={open} handleClick={() => setOpen(false)} data={response} questions={data} />
        </div>)}
      </div>
    </div>
  );
};

export default ViewAssesment;