"use client"


import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import { notification } from 'antd';
import apiService from '@/utils/apiService';
import ThirdPartyManagement from '@/app/tutor/profile/third-party';

const profile = () => {
  const user = useAppSelector((state: { value: any; }) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<any>()
  const [api, contextHolder] = notification.useNotification();
  const [phone, setPhone] = useState("")
  const [skill, setSkill] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [profilePicture, setProfilePicture] = useState<string>()
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const signRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<FileList | null>()
  const [sign, setSign] = useState<FileList | null>()
  const [signature, setSignature] = useState<string | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          // const type = files[0].name.substr(files[0].name.length - 3)
          setProfilePicture(reader.result as string)
        }
      }
    }
  }

  const getUser = () => {
    apiService.get(`user/profile/${user.id}`)
      .then(function (response) {
        setPhone(response.data.user.phone)
        setSkill(response.data.user.skillLevel)
        setAge(response.data.user.age)
        setGender(response.data.user.gender)
        setState(response.data.user.state)
        setCountry(response.data.user.country)
        setProfilePicture(response.data.user.profilePicture)
        setUserData(response.data.user)
        console.log(response.data)
      })
  }

  const addPic = () => {
    setEditing(true)
    const formData = new FormData()
    file && formData.append("image", file[0])
    try {
      apiService.put(`user/updateProfilePicture/${user.id}`, formData)
        .then(function (response) {
          getUser()
          api.open({
            message: 'Profile Picture Updated Successfully!'
          });
          setEditing(false)
          console.log(response.data)
        })
    } catch (e) {
      setEditing(false)
      console.log(e)
    }
  }

  const updateUser = () => {
    setLoading(true)
    try {
      apiService.put(`user/updateProfile/${user.id}`, {
        phone,
        gender,
        age,
        skillLevel: skill,
        country,
        state
      })
        .then(function (response) {
          getUser()
          setLoading(false)
          console.log(response.data)
        })
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }
  const addSign = () => {
    setUploading(true)
    const formData = new FormData()
    sign && formData.append("image", sign[0])
    try {
      apiService.put(`user/signature/${user.id}`, formData)
        .then(function (response) {
          getUser()
          api.open({
            message: 'Signature Updated Successfully!'
          });
          setUploading(false)
          console.log(response.data)
        })
    } catch (e) {
      setUploading(false)
      console.log(e)
    }
  }

  const handelSign = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    setSign(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          // const type = files[0].name.substr(files[0].name.length - 3)
          setSignature(reader.result as string)
        }
      }
    }
  }


  useEffect(() => {
    getUser()
  }, [])
  return (
    <DashboardLayout>
      <section className='lg:w-[25%] mt-4 mx-auto'>
        {contextHolder}
        <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-3 text-center rounded-md'>
          <p className='font-medium text-lg'>Personal Details</p>
          <img onClick={() => uploadRef.current?.click()} src={profilePicture ? profilePicture : "/images/user.png"} className='w-20 h-20 rounded-full object-cover cursor-pointer mx-auto my-3' alt="" />
          <input
            onChange={handleImage}
            type="file"
            name="identification"
            accept="image/*"
            ref={uploadRef}
            hidden
            multiple={false}
          />
          <p className='font-medium'>{user.fullName}</p>
          <p className='text-xs'>{user.email} </p>
          <button onClick={() => addPic()} className='bg-primary p-2 px-6 my-4 font-medium'>{editing ? 'loading...' : 'Edit profile'}</button>
        </div>
        <div className='my-4 text-center p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
          <p className='font-medium text-sm'>Highlights</p>
        </div>

        <div className='my-4 p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>Phone Number</label>
            <input onChange={e => setPhone(e.target.value)} value={phone} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="number" />
          </div>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>Gender</label>
            <input onChange={e => setGender(e.target.value)} value={gender} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
          </div>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>Age</label>
            <input onChange={e => setAge(e.target.value)} value={age} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="number" />
          </div>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>Country of Residence</label>
            <input onChange={e => setCountry(e.target.value)} value={country} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
          </div>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>State of Residence</label>
            <input onChange={e => setState(e.target.value)} value={state} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
          </div>
          <div className='my-2'>
            <label className='text-sm font-medium my-1'>Skill Level</label>
            <input onChange={e => setSkill(e.target.value)} value={skill} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
          </div>
          <div className='text-center'><button onClick={updateUser} className='bg-primary p-2 px-6 my-4 font-medium'>{loading ? "updating..." : "Edit highlights"}</button></div>
        </div>
        <div className='my-4 text-center p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
          <p className='font-medium text-sm'>Upload Signature</p>
        </div>
        <div className='text-center'>
          <div>
            {signature ? (
              <img
                onClick={() => signRef.current?.click()}
                src={signature}
                alt="Uploaded Signature"
                className="w-full h-10 object-cover cursor-pointer mx-auto my-3"
              />
            ) : (
              <div
                className="bg-white shadow-[0px_2px_4px_0px_#1E1E1E21] w-full flex justify-center items-center rounded-md py-4 cursor-pointer"
                onClick={() => signRef.current?.click()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-cloud-arrow-up-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2m2.354 5.146a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0z" />
                </svg>
              </div>
            )}
          </div>

          <input
            onChange={handelSign}
            type="file"
            name="identification"
            accept="image/*"
            ref={signRef}
            hidden
            multiple={false}
          />
          <button onClick={() => addSign()} className='bg-primary p-2 px-6  my-4 font-medium'>{uploading ? 'loading...' : 'Upload Signature'}</button>
        </div>
        <ThirdPartyManagement user={userData} />

      </section>
    </DashboardLayout>
  );
};

export default profile;