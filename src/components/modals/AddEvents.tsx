import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';
import { CategoryType, CourseType } from '@/types/CourseType';
import { Spin, notification } from 'antd';
import Select from 'react-select';
import { UserType } from '@/types/UserType';


const AddEvents = ({ open, handleClick, course }: { open: boolean, handleClick: any, course: CourseType | null }) => {
  const user = useAppSelector((state) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null)
  const [api, contextHolder] = notification.useNotification();

  const [active, setActive] = useState(0)
  const [about, setAbout] = useState(course?.about || "")
  const [startDate, setStartDate] = useState(course?.startDate || "")
  const [endDate, setEndDate] = useState(course?.endDate.toString() || "")
  const [startTime, setStartTime] = useState(course?.startTime || "")
  const [endTime, setEndTime] = useState(course?.endTime || "")
  const [striked, setStriked] = useState<number>(course?.strikedFee || 0)
  const [fee, setFee] = useState<number>(course?.fee || 0)
  const [duration, setDuration] = useState<number>(course?.duration || 0)
  const [category, setCategory] = useState(course?.category || "")
  const [categoryIndex, setCategoryIndex] = useState("")

  const [type, setType] = useState(course?.type || "offline")
  const [title, setTitle] = useState(course?.title || "")
  const [image, setImage] = useState(course?.thumbnail || "")
  const [location, setLocation] = useState(course?.loaction || "")
  const [target, setTarget] = useState(course?.target || 0)
  const [room, setRoom] = useState(course?.room || "")
  const [loading, setLoading] = useState(false)
  const [scholarship, setScholarship] = useState([])
  const [students, setStudents] = useState([])
  const [mode, setMode] = useState("")

  const getStudents = () => {
    axios.get('user/students')
      .then(function (response) {
        setStudents(response.data.students)
        // console.log(response.data)
      })
  }


  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    const reader = new FileReader()
    if (files && files.length > 0) {

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          // const type = files[0].name.substr(files[0].name.length - 3)
          setImage(reader.result as string)
        }
      }
    }
  }


  const edit = () => {
    try {
      setLoading(true)

      axios.put(`events/edit/${course?._id}`,
        {
          // image,
          title,
          about,
          target,
          duration: duration.toString(),
          type,
          startDate,
          endDate,
          startTime,
          endTime,
          category,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          scholarship: "students",
          room,
          location,
          // videos,
          // pdf
        }
      )
        .then(function (response) {
          console.log(response.data)
          setLoading(false)
          handleClick()
        })
    } catch (e) {
      console.log(e)

    }
  }

  const getScholarship = () => {
    const arrayOfIds = scholarship.map((object: any) => object.value)
    return arrayOfIds
  }

  const add = () => {
    // console.log(getScholarship())
    if (title && about && duration && category && image && mode && type === "offline" ? startDate && endDate && startTime && endTime && room && location : startDate && endDate && startTime && endTime) {
      setLoading(true)
      axios.post(`events/add-event/${user.id}`,
        {
          image,
          title,
          about,
          duration: duration.toString(),
          mode,
          type,
          target,
          startDate,
          endDate,
          startTime,
          endTime,
          category: category === "" ? categoryIndex : category,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          room,
          location,
          scholarship: getScholarship()
        }
      )
        .then(function (response) {
          // console.log(response.data)
          api.open({
            message: "Events Created Successfully!"
          });
          setLoading(false)
          handleClick()
        }).catch(error => {
          api.open({
            message: error.response.data.message
          });
        })
    } else {
      api.open({
        message: "Please fill all fields!"
      });
    }
  }

  const [categories, setCategories] = useState<CategoryType[]>([])

  const getCategories = () => {
    axios.get('category/all').then(function (response) {
      // console.log(response.data)
      setCategories(response.data.category)
    }).catch(error => {
      console.log(error)
    })
  }

  useEffect(() => {
    getStudents()
    getCategories()
  }, [])

  const formattedOptions = students.map((option: UserType) => ({ value: option.studentId, label: option.fullname }));


  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          {course === null ? <p className='font-medium'>Add Event</p> : <p className='font-medium'>Edit Event</p>
          }
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        {contextHolder}
        <div className='lg:flex justify-between lg:mx-12 mx-4 my-4'>
          <div className='lg:w-[48%]'>
            <div>
              <p className='text-sm font-medium my-1'>Event Image</p>
              {image ? <img onClick={() => uploadRef.current?.click()} src={image} className='w-full object-cover h-52' alt="" /> :
                <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                  <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                  <p> Add course</p>
                </button>}
            </div>
            <div className='flex my-1'>
            </div>
            <input
              onChange={handleImage}
              type="file"
              name="identification"
              accept="image/*"
              ref={uploadRef}
              hidden
              multiple={false}
            />

          </div>
          <div className='lg:w-[48%]'>
            <div className='border-b font-medium flex justify-between border-[#1E1E1E12]'>
              <div className={active === 0 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(0)}>Event Descriptions</p>
              </div>
              <div className={active === 1 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(1)}>Event Details</p>
              </div>
              <div className={active === 2 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(2)}>Fee</p>
              </div>
            </div>
            <div>
              {(() => {
                switch (active) {
                  case 0:
                    return <div>
                      <div className='flex justify-between'>
                        <div className='my-1 w-[48%]'>
                          <label className='text-sm font-medium my-1'>Event Type</label>
                          <select onChange={e => setMode(e.target.value)} value={mode} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option value="conference">Conference</option>
                            <option value="seminar">Seminar</option>
                            <option value="workshop">Workshop</option>
                          </select>
                        </div>
                        <div className='my-1 w-[48%]'>
                          <label className='text-sm font-medium my-1'>Event Mode</label>
                          <select onChange={e => setType(e.target.value)} value={type} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </select>
                        </div>
                      </div>
                      <div className='flex justify-between my-1'>
                        <div className='w-full'>
                          <label className='text-sm font-medium my-1'>Course Category</label>
                          <select onChange={e => setCategoryIndex(e.target.value)} value={categoryIndex} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option className='hidden' value="">Select Category</option>
                            {categories.map((single, index) => <option key={index} value={single.category}>{single.category}</option>)}
                          </select>
                        </div>
                        {categories.map(single => single.category === categoryIndex && single.subCategory.length >= 1 && <div key={single._id} className='w-full ml-3'>
                          <label className='text-sm font-medium my-1'>Sub Category</label>
                          <select onChange={e => setCategory(e.target.value)} value={category} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            {single.subCategory.map((sub, index) => <option key={index} value={sub}>{sub}</option>)}
                          </select>
                        </div>)}
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Target</label>
                        <input onChange={e => setTarget(e.target.value)} value={target} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Event title</label>
                        <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>About event</label>
                        <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
                      </div>
                    </div>
                  case 1:
                    return <div>

                      <div className='flex justify-between mt-6 my-1'>
                        <div className='w-full'>
                          <label className='text-sm font-medium my-1'>Duration</label>
                          <input onChange={e => setDuration(parseInt(e.target.value))} value={duration} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        </div>
                      </div>
                      {type === 'online' ? <>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start date</label>
                            <input onChange={e => setStartDate(e.target.value)} value={startDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End date</label>
                            <input onChange={e => setEndDate(e.target.value)} value={endDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start time</label>
                            <input onChange={e => setStartTime(e.target.value)} value={startTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End time</label>
                            <input onChange={e => setEndTime(e.target.value)} value={endTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                      </> : null}
                      {type === 'offline' && <>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start date</label>
                            <input onChange={e => setStartDate(e.target.value)} value={startDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End date</label>
                            <input onChange={e => setEndDate(e.target.value)} value={endDate} type="date" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Start time</label>
                            <input onChange={e => setStartTime(e.target.value)} value={startTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>End time</label>
                            <input onChange={e => setEndTime(e.target.value)} value={endTime} type="time" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                        <div className='flex justify-between my-1'>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Event Location</label>
                            <input placeholder='Place where this event will hold' onChange={e => setLocation(e.target.value)} value={location} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                          <div className='w-[48%]'>
                            <label className='text-sm font-medium my-1'>Event Room</label>
                            <input placeholder='Room No.' onChange={e => setRoom(e.target.value)} value={room} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                          </div>
                        </div>
                      </>}
                    </div>
                  case 2:
                    return <div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Event Fee</label>
                        <input onChange={e => setFee(parseInt(e.target.value))} value={fee} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        <p className='text-xs'>Set course fee to 0 for a free course</p>
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Who attends this event for free (Scholarship)</label>
                        <Select
                          isMulti
                          options={formattedOptions}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={(e: any) => { setScholarship(e) }}
                        />
                      </div>
                      <div className='my-5'>
                        <label className='text-sm font-medium my-1'>Show striked out original cost fee</label>
                        <input type='number' onChange={e => setStriked(parseInt(e.target.value))} value={striked} className='border rounded-md border-[#1E1E1ED9] w-full h-20 p-2 bg-transparent' />
                      </div>
                    </div>
                  default:
                    return null
                }
              })()}
              <div>
                <p className='text-sm my-4'>By uploading you agree that this course is a product of you
                  and not being forged<input className='ml-2' type="checkbox" /></p>
                <div className='flex'>
                  {course === null ? active === 2 ? <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? <Spin /> : "Create Event"}</button> : <button onClick={() => setActive(active + 1)} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>Next</button> : active === 2 ? <button onClick={() => edit()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? <Spin /> : "Edit Event"}</button> : <button onClick={() => setActive(active + 1)} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>Next</button>}
                  <button onClick={() => handleClick()} className='mx-4'>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvents;