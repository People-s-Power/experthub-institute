import apiService from '@/utils/apiService';
import { notification, Spin } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const SignUpComp = ({ role, action, contact }: { role: string, contact?: boolean, action?: () => void }) => {
  const [api, contextHolder] = notification.useNotification();
  const [active, setActive] = useState(false)
  const [fullname, setName] = useState("")
  const [orgName, setOrgName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("nigeria")
  const [state, setState] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
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


  const signupApplicant = async () => {
    if (fullname && email && phone && country && state && address && password) {
      if (password === confirmPassword) {
        setLoading(true)
        apiService.post(`/auth/register`, {
          fullname,
          email,
          phone,
          country,
          contact,
          state,
          address,
          password,
          userType: role,
          organizationName: orgName
        })
          .then(function (response) {
            console.log(response.data)
            api.open({
              message: response.data.message
            });
            setLoading(false)
            if (action) {
              action()
            } else {
              router.push(`/auth/verify?user=${response.data.id}&enroll=${searchParams.get('enroll')}`)
            }
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
          message: "Password don't match confirm password"
        });
      }
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }

  const handleGoogleLogin = () => {
    setGoogleLoading(true)
    window.location.href = `${apiService.getUri()}auth/google?role=${role}&redirectUrl=/auth/login`
  }
  return (
    <div>
      {contextHolder}
      <div>
        <div className='my-2 text-xs'>
          <label className='font-medium'>Full Name</label>
          <input onChange={e => setName(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="text" placeholder='e.g John' />
        </div>
        {role === 'tutor' && <div className='my-2 text-xs'>
          <label className='font-medium'>Organization's Name</label>
          <input onChange={e => setOrgName(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="text" placeholder='e.g Experthub Institute' />
        </div>}
        <div className='my-2 text-xs'>
          <label className='font-medium'>Email</label>
          <input onChange={e => setEmail(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="email" placeholder='Sample@gmail.com' />
        </div>
        <div className='flex justify-between'>
          <div className='my-2 text-xs w-full'>
            <label className='font-medium'>Phone number</label>
            <input onChange={e => setPhone(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="number" placeholder='eg: 0122 222 000' />
          </div>
          {/* <div className='my-2 text-xs w-[48%]'>
            <label className='font-medium'>Country</label>
            <select onChange={e => setCountry(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm'>
              <option value="nigeria">nigeria</option>
            </select>
          </div> */}
        </div>
        <div className='flex justify-between'>
          <div className='my-2 text-xs w-[48%]'>
            <label className='font-medium'>State</label>
            <select onChange={e => setState(e.target.value)} value={state} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm'>
              <option className='hidden' value="">Select your state</option>
              {states_in_nigeria.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>
          <div className='my-2 text-xs w-[48%]'>
            <label className='font-medium'>Address</label>
            <input onChange={e => setAddress(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="text" placeholder='' />
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='my-2 text-xs w-[48%]'>
            <label className='font-medium'>Password</label>
            <input onChange={e => setPassword(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type="password" placeholder='************' />
          </div>
          <div className='my-2 text-xs w-[48%] relative'>
            <label className='font-medium'>Confirm Password</label>
            <input onChange={(e) => setConfirmPassword(e.target.value)} className='w-full border my-1 border-[#FA815136] p-2 rounded-sm' type={active ? "text" : "password"} placeholder='************' />
            <img onClick={() => setActive(!active)} className='absolute top-7 right-2 cursor-pointer' src="/images/icons/eyes.svg" alt="" />
          </div>
        </div>
        <div className='my-2 text-xs'>
          <button onClick={() => signupApplicant()} className='w-full bg-primary p-2 rounded-sm font-medium'>{loading ? "Loading..." : "Signup"}</button>
        </div>
        <div className="my-4 text-center font-semibold text-xs">
          Or
        </div>
        <div className="my-2 text-xs">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border border-gray-300 bg-white p-2 rounded-sm font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            {googleLoading ? (
              <Spin />
            ) : (
              <>
                <img
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  alt="Google"
                  className="w-4 h-4 mr-2"
                  onError={(e) => {
                    e.currentTarget.src = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                  }}
                />
                Sign up with Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUpComp;