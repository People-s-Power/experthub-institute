"use client"

import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState } from 'react';
import AdmissionCard from '@/components/cards/AdmissionCard';
import { useAppSelector } from '@/store/hooks';
import { UserType } from '@/types/UserType';
import SignUpComp from '@/components/SignUpComp';
import { Modal } from 'antd';
import apiService from '@/utils/apiService';
import GoPremuim from '@/components/modals/GoPremuium';
import { isActionChecked } from '@/utils/checkPrivilege';

const addmissions = () => {
  const [active, setActive] = useState("students")
  const user = useAppSelector((state) => state.value);
  const [students, setStudents] = useState<UserType | []>([])
  const [mentees, setMentees] = useState<UserType | []>([])

  const [all, setAll] = useState<UserType | []>([])
  const [contact, setContact] = useState(false)
  const [showPremuim, setShowPremuim] = useState(false)

  const getMentees = () => {
    apiService.put('/user/mymentees', {
      course: user.assignedCourse,
    })
      .then(function (response) {
        setMentees(response.data.students)
        setAll(response.data.students)
        console.log(response.data)
      })
  }

  const getStudents = () => {
    apiService.put('/user/mystudents', {
      id: user.id
    })
      .then(function (response) {
        setStudents(response.data.students)
        console.log(response.data.students)
      })
  }

  const search = (value: string) => {
    const results = all.filter((obj: UserType) => obj.fullname.toLowerCase().includes(value.toLowerCase()));
    setStudents(results)
  }


  useEffect(() => {
    getStudents()
    getMentees()
  }, [])
  return (
    <DashboardLayout>
      {/* <SearchNav /> */}
      <div className='flex m-4'>
        <div className='w-1/2 relative '>
          <input onChange={e => search(e.target.value)} type="text" className='pl-10 p-2 w-full rounded-md border border-[#1E1E1E8A] bg-transparent' placeholder='Search courses, trainer, test etc' />
          <img className='absolute top-2 w-6 left-2' src="/images/icons/search.svg" alt="" />
        </div>

        <button onClick={() => {
          if (isActionChecked("Add Contacts", user.privileges)) {
            setContact(true);
          }
        }} className='bg-primary px-4 my-auto p-2 ml-6'>Add Contact</button>
      </div>

      <section className='m-4'>
        <div className='flex justify-between lg:w-1/2'>
          {/* <div onClick={() => setActive("contact")} className={active === "contact" ? "border-b-2 border-[#DC9F08] py-2" : "py-2 cursor-pointer"}>
            <p className='font-medium text-lg'>Contacts</p>
          </div> */}
          <div onClick={() => setActive("students")} className={active === "students" ? "border-b-2 border-[#DC9F08] py-2" : "py-2 cursor-pointer"}>
            <p className='font-medium text-lg'>My Students</p>
          </div>
          <div onClick={() => setActive("mentees")} className={active === "mentees" ? "border-b-2 border-[#DC9F08] py-2" : "py-2 cursor-pointer"}>
            <p className='font-medium text-lg'>My Mentees</p>
          </div>
          <div onClick={() => setActive("graduates")} className={active === "graduates" ? "border-b-2 border-[#DC9F08] py-2" : "py-2 cursor-pointer"}>
            <p className='font-medium text-lg'>My Graduates</p>
          </div>
        </div>
        {(() => {
          switch (active) {
            case 'contact':
              return <div>
                {
                  students.map((student: UserType, index: any) => student.contact ? <AdmissionCard setShowPremium={setShowPremuim} role={active} tutor={student} key={index} /> : null)
                }
              </div>
            case 'students':
              return <div>
                {
                  students.map((student: UserType, index: any) => <AdmissionCard setShowPremium={setShowPremuim} role={active} tutor={student} key={index} />)
                }
              </div>
            case 'mentees':
              return <div>
                {
                  mentees.map((student: UserType, index: any) => <AdmissionCard setShowPremium={setShowPremuim} role={active} tutor={student} key={index} />)
                }
              </div>
            case 'graduates':
              return <div>
                {
                  students.map((student: UserType, index: any) => student.graduate && <AdmissionCard setShowPremium={setShowPremuim} role={active} tutor={student} key={index} />)
                }
              </div>
            default:
              return null
          }
        })()}
        <Modal title="Add Contact" footer={[]} open={contact} onOk={() => setContact(false)} onCancel={() => setContact(false)}>
          <SignUpComp role='student' action={() => getStudents()} />
        </Modal>
        <GoPremuim show={showPremuim} setShow={setShowPremuim} />

      </section>
    </DashboardLayout>
  );
};

export default addmissions;