"use client"

import DashboardLayout from '@/components/DashboardLayout';
import { useAppSelector } from '@/store/hooks';
import { UserType } from '@/types/UserType';
import apiService from '@/utils/apiService';
import { notification } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import tutor from '../page';
import Select from 'react-select';
import { isActionChecked } from '@/utils/checkPrivilege';

const team = () => {
  const [api, contextHolder] = notification.useNotification();
  const [tutor, setTutor] = useState("")
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.value);
  const [team, setTeam] = useState([])
  const [instructors, setInstructors] = useState([])
  const [open, setOpen] = useState(false)

  const [privileges, setPrivileges] = useState([
    { value: "Create course", checked: false },
    { value: "Create Event", checked: false },
    { value: "Send Assessment", checked: false },
    { value: "Add Assessment", checked: false },
    { value: "Delete Assessment", checked: false },
    { value: "Edit Assessment", checked: false },
    { value: "View Assessment", checked: false },
    { value: "Make Graduate", checked: false },
    { value: "Send Email", checked: false },
    { value: "Respond to Chats", checked: false },
    { value: "Add, delete and edit additional resources", checked: false },
    { value: "Add, delete and edit categories", checked: false },
    { value: "Add Contacts", checked: false },
    { value: "Review Courses", checked: false },
    { value: "Create and set appointment", checked: false },
    { value: "Handle appointments", checked: false },
    { value: "Block and unblock Students", checked: false },
    { value: "Block and unblock tutors", checked: false },
    { value: "Assign course to a Tutor", checked: false },
    { value: "Enroll students", checked: false },
    { value: "Edit Course", checked: false },
    { value: "Delete Course", checked: false },
    { value: "Delete Event", checked: false },
    { value: "View Course Participant and send email reminder", checked: false },
    { value: "Delete team member", checked: false },
    { value: "Edit team member", checked: false },
    { value: "Add team member", checked: false },

    // Newly Added Privileges
    { value: "View Profile Details", checked: false },
    { value: "Edit Profile Image", checked: false },
    { value: "Update Bank Account", checked: false },
    { value: "Edit Basic information", checked: false },
    { value: "Edit Signature", checked: false },
    { value: "Switch Roles to Student platform of the Training Provider", checked: false },
    { value: "Add Course Category for the Training Provider", checked: false },
    { value: "Delete Category for Training Provider", checked: false },
    { value: "Enroll Course for Training Provider", checked: false },
    { value: "Make Enquiries for Training Provider", checked: false },
    { value: "View Wallet", checked: false },
    { value: "Withdraw from Wallet", checked: false },
    { value: "Fund Wallet", checked: false },
    { value: "Add and Change Linked Google Account", checked: false },
    { value: "View Calender", checked: false }
  ]);


  const addTeam = async () => {
    if (tutor === "") {
      api.open({
        message: "Select a tutor to assign!"
      });
      return
    }
    setLoading(true)
    apiService.post(`/auth/add-team`, {
      ownerId: user.id,
      tutorId: tutor,
      privileges
    })
      .then(function (response) {
        console.log(response.data)
        api.open({
          message: response.data.message
        });
        setTutor("")
        getTeam()
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        api.open({
          message: error.response.data.message
        });
        console.log(error.response.data.message)
      })
  }

  const updatePriviledge = async (id: any) => {
    setLoading(true)
    apiService.post(`/auth/edit-team`, {
      ownerId: user.id,
      tutorId: id,
      newPrivileges: privileges
    })
      .then(function (response) {
        console.log(response.data)
        api.open({
          message: response.data.message
        });
        setTutor("")
        getTeam()
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        api.open({
          message: error.response.data.message
        });
        console.log(error.response.data.message)
      })
  }

  const getTutors = async () => {
    try {
      apiService.get('/user/instructors')
        .then(function (response) {
          console.log(response.data.instructors)
          setInstructors(response.data.instructors)
        })
    } catch (e) {
      console.log(e)
    }
  }

  const getTeam = () => {
    apiService.get(`/user/team/${user.id}`)
      .then(function (response) {
        console.log(response.data.teamMembers)
        setTeam(response.data.teamMembers)
      })
  }

  const removeTeam = (id: any) => {
    apiService.delete(`/user/team/${id}/${user.id}`)
      .then(function (response) {
        console.log(response)
        getTeam()
      })
  }


  const updateStatus = (id: any, status: string) => {
    apiService.get(`/user/team/${user.id}/${id}/${status}`)
      .then(function (response) {
        console.log(response)
        api.open({
          message: response.data.message
        });
        getTeam()
      })
  }

  useEffect(() => {
    getTeam()
    getTutors()
  }, [])

  const handleInputChange = (index: number, value: boolean) => {
    const updatedObjects = [...privileges];
    updatedObjects[index] = { ...updatedObjects[index], checked: value };
    setPrivileges(updatedObjects);
  };


  const filteredTeam = team.filter((single: any) => single.ownerId?._id === user.id || single.status === 'pending')

  const options = instructors
    .filter((item: UserType) => !item.blocked && item.id !== user.id)
    .map((item: UserType) => ({
      value: item.id,
      label: item.fullname, // plain text label for search
      profilePicture: item.profilePicture,
    }));



  return (
    <DashboardLayout>
      <main className='lg:flex justify-between px-6 py-4'>
        {contextHolder}
        <section className='lg:w-[48%] shadow-md rounded-md p-4 sm:mb-6'>
          <div>
            <label className=''>Add Team Member</label> <br />
            <Select
              options={options}
              onChange={(selectedOption) => setTutor(selectedOption?.value || '')}
              placeholder="Add team member"
              className="react-select-container"
              classNamePrefix="react-select"
              isSearchable
              formatOptionLabel={(e) => (
                <div className="flex items-center">
                  <img
                    src={e.profilePicture || '/images/user.png'}
                    alt={e.label}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span>{e.label}</span>
                </div>
              )}
            />
            {/* <select onChange={(e) => setTutor(e.target.value)} className='border p-4 w-full mt-1'>
              <option className='hidden' value="">Add team member</option>
              {instructors.map((item: UserType) => item.blocked || item.id === user.id ? null : <option value={item.id} key={item.id}>{item.fullname}</option>)}
            </select> */}
            {tutor && <div className='my-4'>
              <p className='mb-4'>Assign roles by selecting any of the following area:</p>

              {privileges.map((single, index) => <div key={index} className='flex my-1'>
                <input onChange={(e) => handleInputChange(index, e.target.checked)} type="checkbox" checked={single.checked} className='mr-4' />
                <p>{single.value}</p>
              </div>)}
            </div>}

            <div className='my-2 text-xs'>
              <button onClick={() => {
                if (isActionChecked("Add team member", user.privileges)) {
                  addTeam()
                }
              }}
                className='w-full bg-primary p-2 rounded-sm font-medium'>{loading ? "Loading..." : "Add Team"}</button>
            </div>
          </div>
        </section>
        <section className='lg:w-[48%] shadow-md p-4 rounded-md'>
          {filteredTeam.length >= 1 ? filteredTeam.map((single: any) => <div className='my-3 p-2 border-b border-[#808080] lg:flex justify-between' key={single._id}>
            <div className='flex cursor-pointer'>
              <img className='h-14 w-14 mr-3 rounded-full my-auto' src={single.tutorId.profilePicture ? single.tutorId.profilePicture : '/images/user.png'} alt="" />
              <div>
                <p className=' capitalize text-lg'>{single.tutorId.fullname}</p>
                <p>{single.tutorId.email}</p>
              </div>
            </div>
            {
              open && <div>
                <div onClick={() => setOpen(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
                <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
                  <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
                    <p className='font-medium'>Edit Roles</p>
                    <img onClick={() => setOpen(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
                  </div>
                  <div className='p-4'>
                    {privileges.map((single: any, index: any) => <div key={index} className='flex my-1'>
                      <input onChange={(e) => handleInputChange(index, e.target.checked)} type="checkbox" checked={single.checked} className='mr-4' />
                      <p>{single.value}</p>
                    </div>)}

                    <button className='p-4 bg-primary mt-6 px-6' onClick={() => { updatePriviledge(single.tutorId._id), setOpen(false) }}>{loading ? 'loading...' : 'Save'}</button>
                  </div>
                </div>
              </div>
            }
            {
              user.id === single.ownerId?._id ?
                <div className='flex w-20 justify-between sm:mt-3'>
                  <button onClick={() => {
                    if (isActionChecked("Edit team member", user.privileges)) {
                      setOpen(true), setPrivileges(single.privileges)
                    }
                  }} className=''>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                    </svg>
                  </button>
                  <button className='text-red' onClick={() => {
                    if (isActionChecked("Delete team member", user.privileges)) {
                      removeTeam(single.tutorId._id)
                    }
                  }}  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
                    </svg>
                  </button>
                </div>
                :
                <div className="flex w-38 justify-between">
                  <button onClick={() => updateStatus(single.ownerId._id, 'accepted')} className="bg-green-500 my-auto text-white px-2 py-1 rounded-full">Accept</button>
                  <button onClick={() => updateStatus(single.ownerId._id, 'rejected')} className="bg-red-500 my-auto px-2 text-white py-1 rounded-full">Reject</button>
                </div>
            }

          </div>) : <div>
            <img src="/images/unread.jpg" alt="" />
            <p className='text-center my-3'>No added team member!</p></div>}
        </section>
      </main>
    </DashboardLayout >
  );
};

export default team;