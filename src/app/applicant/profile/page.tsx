"use client"

import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { notification } from 'antd';
import apiService from '@/utils/apiService';
import { CategoryType } from '@/types/CourseType';

const profile = () => {
  const user = useAppSelector((state) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null)
  const [api, contextHolder] = notification.useNotification();
  const [phone, setPhone] = useState("")
  const [skill, setSkill] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [loading, setLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string>()
  const [editing, setEditing] = useState(false)
  const [file, setFile] = useState<FileList | null>()
  const [saving, setSaving] = useState(false)
  const [fullname, setFullname] = useState("")

  const [category, setCategory] = useState("")
  const [categoryIndex, setCategoryIndex] = useState("")
  const [categories, setCategories] = useState<CategoryType[]>([])

  const getCategories = () => {
    apiService.get('category/all').then(function (response) {
      setCategories(response.data.category)
    }).catch(error => {
      console.log(error)
    })
  }
  useEffect(() => {
    getCategories()
  }, [])

  const saveChanges = async () => {
    setSaving(true)
    await apiService.put(`user/assign/${user.id}`, {
      course: category === "" ? categoryIndex : category
    }).then(function (response) {
      console.log(response.data)
      setSaving(false)
    }).catch(error => {
      console.log(error)
      setSaving(false)
    })
  }
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
        setFullname(response.data.user.fullName)

        console.log(response.data)
      })
  }

  const updateUser = () => {
    setLoading(true)
    try {
      apiService.put(`user/updateProfile/${user.id}`, {
        phone,
        gender,
        age,
        skillLevel: skill,
        fullname,
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

  useEffect(() => {
    getUser()
  }, [])

  return (
    <DashboardLayout>
      <section className='lg:flex justify-evenly'>
        {contextHolder}
        <div className='lg:w-[25%] mx-auto sm:p-4 mt-4'>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-3 text-center rounded-md'>
            <p className='font-medium text-lg'>Personal Details</p>
            <img onClick={() => uploadRef.current?.click()} src={profilePicture ? profilePicture : "/images/user.png"} className='w-20 object-cover h-20 rounded-full mx-auto my-3 cursor-pointer' alt="" />
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
            <p className='text-xs'>{user.email}</p>
            <button onClick={() => addPic()} className='bg-primary p-2 px-6 my-4 font-medium'>{editing ? 'loading...' : 'Edit profile'}</button>
          </div>
          <div className='my-4 text-center p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
            <p className='font-medium text-sm'>Highlights</p>
          </div>
          <div className='my-4 p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>

            <div className='my-2'>
              <label className='text-sm font-medium my-1'>Full Name</label>
              <input onChange={e => setFullname(e.target.value)} value={fullname} className='bg-transparent border-b border-[#1E1E1E66] w-full' type="text" />
            </div>
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
          <div id='interests' className='my-4 text-center p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md'>
            <p className='font-medium text-sm'>Course Interests</p>
          </div>
          <div className=' p-3 shadow-[0px_2px_4px_0px_#1E1E1E21] rounded-md my-4'>
            <div className='w-full my-2'>
              <label className='text-sm font-medium my-1'>Category</label>
              <select onChange={e => setCategoryIndex(e.target.value)} value={categoryIndex} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option className='hidden' value="">Select Category</option>
                {categories.map((single, index) => <option key={index} value={single.category}>{single.category}</option>)}
              </select>
            </div>
            {categories.map(single => single.category === categoryIndex && single.subCategory.length >= 1 && <div key={single._id} className='w-full my-2'>
              <label className='text-sm font-medium my-1'>Sub Category</label>
              <select onChange={e => setCategory(e.target.value)} value={category} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                <option className='hidden' value="">Select Sub-Category</option>
                {single.subCategory.map((sub, index) => <option key={index} value={sub}>{sub}</option>)}
              </select>
            </div>)}
            <div className='text-center'><button onClick={() => saveChanges()} className='bg-primary p-2 px-6 my-4 font-medium'>{saving ? "saving..." : "Save Changes"}</button></div>
          </div>
        </div>

        {/* <div className='mt-4 sm:p-4 lg:w-[65%]'>
          <p className='text-xl font-medium my-3'>Courses</p>
          <div className='shadow-[0px_2px_4px_0px_#1E1E1E21] p-3 rounded-md'>
            <p className='text-sm my-3'>Selected courses</p>
            <div className='lg:flex justify-between border p-3 my-3 lg:w-[80%] rounded-md border-[#1E1E1E75]'>
              <div className='lg:flex '>
                <img className='lg:w-32 rounded-md' src="/images/card.png" alt="" />
                <div className='lg:mx-4 sm:my-4'>
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
              <div className='lg:w-[80%]'>
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
              <div className='lg:flex justify-between'>
                <div className='lg:flex'>
                  <img className='w-12 mr-4 h-10' src="/images/peoples-pow.png" alt="" />
                  <div className='sm:my-4'>
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
              <div className='lg:w-[80%]'>
                <p className='font-medium my-3'>Credentials</p>
                <p className='text-sm'>Add your school experience here. If you’re just starting out,
                  you can add certificate gotten</p>
              </div>
              <div className=''>
                <img src="/images/icons/iconamoon_edit-bold.png" alt="" />
              </div>
            </div>
            <div className='border-t mt-4 border-[#1E1E1E4F]'>
              <div className='lg:flex pt-4 justify-between'>
                <div className='lg:flex'>
                  <img className='w-12 mr-4 h-10' src="/images/peoples-pow.png" alt="" />
                  <div className='sm:my-4'>
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
        </div> */}
      </section>
    </DashboardLayout>

  );
};

export default profile;