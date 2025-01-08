"use client"

import DashboardLayout from '@/components/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';
import { notification } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const team = () => {
  const [api, contextHolder] = notification.useNotification();
  const [fullname, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("nigeria")
  const [state, setState] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.value);
  const [team, setTeam] = useState([])
  const states_in_nigeria = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
    "Federal Capital Territory"
  ]

  const addTeam = async () => {
    if (fullname && email && phone && country && state && address && password) {
      setLoading(true)
      apiService.post(`/auth/add-team`, {
        fullname,
        email,
        phone,
        country,
        state,
        address,
        password,
        tutorId: user.id
      })
        .then(function (response) {
          console.log(response.data)
          api.open({
            message: response.data.message
          });
          setLoading(false)
          setAddress("")
          setCountry("")
          setEmail("")
          setName("")
          setPassword("")
          setPhone("")
          setState("")
        })
        .catch(error => {
          setLoading(false)
          api.open({
            message: error.response.data.message
          });
          console.log(error.response.data.message)
        })
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }

  const getTeam = () => {
    apiService.get(`/user/team/${user.id}`)
      .then(function (response) {
        console.log(response.data.teamMembers)
        setTeam(response.data.teamMembers)
      })
  }

  useEffect(() => {
    getTeam()
  }, [])
  return (
    <DashboardLayout>
      <main className='flex justify-between px-6 py-4'>
        <section className='w-[48%] shadow-md rounded-md p-4'>
          <div>
            <div className='my-2 text-xs'>
              <label className='font-medium'>Full Name</label>
              <input onChange={e => setName(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="text" placeholder='e.g John' />
            </div>
            <div className='my-2 text-xs'>
              <label className='font-medium'>Email</label>
              <input onChange={e => setEmail(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="email" placeholder='Sample@gmail.com' />
            </div>
            <div className='my-2 text-xs w-full'>
              <label className='font-medium'>Phone number</label>
              <input onChange={e => setPhone(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="number" placeholder='eg: 0122 222 000' />
            </div>
            <div className='my-2 text-xs w-full'>
              <label className='font-medium'>State</label>
              <select onChange={e => setState(e.target.value)} value={state} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm'>
                <option className='hidden' value="">Select your state</option>
                {states_in_nigeria.map(value => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
            <div className='my-2 text-xs w-full'>
              <label className='font-medium'>Address</label>
              <input onChange={e => setAddress(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="text" placeholder='90 Aba Road PH' />
            </div>
            {/* </div> */}
            {/* <div className='flex justify-between'> */}
            <div className='my-2 text-xs w-full'>
              <label className='font-medium'>Password</label>
              <input onChange={e => setPassword(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="password" placeholder='************' />
            </div>
            {/* </div> */}
            <div className='my-2 text-xs'>
              <button onClick={() => addTeam()} className='w-full bg-primary p-2 rounded-sm font-medium'>{loading ? "Loading..." : "Add Team"}</button>
            </div>
          </div>
        </section>
        <section className='w-[48%] shadow-md p-4 rounded-md'>
          {team.map((single: any) => <div className='my-3 p-2 border-b border-[#808080] flex' key={single._id}>
            <img className='h-14 w-14 mr-3 rounded-full my-auto' src={single.profilePicture ? single.profilePicture : '/images/user.png'} alt="" />
            <div>
              <p className='font-bold capitalize text-lg'>{single.fullname}</p>
              <p>{single.email}</p>
            </div>
          </div>)}
        </section>
      </main>
    </DashboardLayout >
  );
};

export default team;