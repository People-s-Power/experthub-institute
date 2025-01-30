"use client"

import AssesmentCard from '@/components/cards/AssesmentCard';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { AssesmentType } from '@/types/AssesmentType';
import apiService from '@/utils/apiService';
import { isActionChecked } from '@/utils/checkPrivilege';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const assesment = () => {
  const [assesments, setAssesment] = useState<AssesmentType | []>([])
  const user = useAppSelector((state) => state.value);
  const router = useRouter()

  const getAssesment = async () => {
    await apiService.get(`assessment/get-assessment-questions`)
      .then(function (response) {
        setAssesment(response.data.assessmentQuestions.reverse())
        console.log(response.data.assessmentQuestions)
      })
  }
  useEffect(() => {
    getAssesment()
  }, [])

  return (
    <DashboardLayout>
      {/* <section className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-6 text-center'>
        <p className='text-lg font-medium'>Assessment Templates</p>
      </section> */}
      <section className='p-10'>
        <div className='text-center'>

          <button onClick={() => {
            if (isActionChecked("Add Assessment", user.privileges)) {
              router.push("/tutor/assesment/new");
            }
          }} className='p-2 bg-[#D9D9D9] font-medium px-10'>+ Add Assesmment</button>
        </div>
        <div className='flex mt-10 justify-between flex-wrap'>
          {assesments.map((assesment: AssesmentType) => <AssesmentCard key={assesment._id} assesment={assesment} />)}
          {/* <AssesmentCard />
          <AssesmentCard /> */}

        </div>
      </section>
    </DashboardLayout>
  );
};

export default assesment;