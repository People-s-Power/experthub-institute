import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';


const AddCourse = ({ open, handleClick }: { open: boolean, handleClick: any }) => {
  const user = useAppSelector((state) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null)
  const [active, setActive] = useState(0)
  const [author, setAuthor] = useState("")
  const [about, setAbout] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [striked, setStriked] = useState<number>(0)
  const [fee, setFee] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [category, setCategory] = useState("")
  const [privacy, setPrivacy] = useState("")
  const [type, setType] = useState("")
  const [title, setTitle] = useState("")
  const [image, setImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<FileList | null>()

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = e.target.files
    setFile(e.target.files)

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

  const add = () => {
    try {
      setLoading(true)
      const formData = new FormData()
      file && formData.append("image", file[0])
      formData.append("title", title)
      formData.append("about", about)
      formData.append("duration", duration.toString())
      formData.append("type", type)
      formData.append("startDate", startDate)
      formData.append("endDate", endDate)
      formData.append("startTime", startTime)
      formData.append("endTime", endTime)
      formData.append("category", category)
      formData.append("privacy", privacy)
      formData.append("fee", fee.toString())
      formData.append("strikedFee", striked.toString())
      formData.append("scholarship", "students")

      axios.post(`https://shark-app-2-k9okk.ondigitalocean.app/courses/add-course/${user.id}`,
        formData
      )
        .then(function (response) {
          console.log(response.data)
          setLoading(false)
          handleClick()
        })
    } catch (e) {
      setLoading(false)
      console.log(e)
    }
  }

  return (
    open && <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 w-[70%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 px-12 flex justify-between'>
          <p className='font-medium'>Add Thumbnail</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='flex justify-between mx-12 my-4'>
          <div className='w-[48%]'>
            <div>
              <p className='text-sm font-medium my-1'>Course Thumbnail</p>
              <button className='border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p> Add course</p></button>
            </div>
            <div className='flex my-1'>
              {image && <img src={image} className='w-12 h-10' alt="" />}
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

            <div>
              <p className='text-sm font-medium my-1'>Course Content</p>
              <button className='border border-[#1E1E1ED9] h-32 p-2 my-1 rounded-md font-medium w-full' onClick={() => uploadRef.current?.click()}>
                <img src="/images/icons/upload.svg" className='w-8 mx-auto' alt="" />
                <p> Click to upload</p></button>
            </div>
            {/* <Dragger {...props}>
              <div className=''>
                <img src="/images/icons/upload.svg" className='mx-auto' alt="" />
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </div>
            </Dragger> */}
          </div>
          <div className='w-[48%]'>
            <div className='border-b font-medium flex justify-between border-[#1E1E1E12]'>
              <div className={active === 0 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(0)}>Course Details</p>
              </div>
              <div className={active === 1 ? 'border-b border-primary p-2' : 'p-2 cursor-pointer'}>
                <p onClick={() => setActive(1)}>Descriptions</p>
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
                      <div className='flex justify-between my-1'>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'>Course Category</label>
                          <input onChange={e => setCategory(e.target.value)} value={category} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        </div>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'>Privacy</label>
                          <input onChange={e => setPrivacy(e.target.value)} value={privacy} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        </div>
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Course title</label>
                        <input onChange={e => setTitle(e.target.value)} value={title} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>About course</label>
                        <textarea onChange={e => setAbout(e.target.value)} value={about} className='border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent'></textarea>
                      </div>
                    </div>
                  case 1:
                    return <div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Instructor Name</label>
                        <input onChange={e => setAuthor(e.target.value)} value={author} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div>
                      <div className='flex justify-between mt-6 my-1'>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'>Duration</label>
                          <input onChange={e => setDuration(parseInt(e.target.value))} value={duration} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        </div>
                        <div className='w-[48%]'>
                          <label className='text-sm font-medium my-1'>Course type</label>
                          <select onChange={e => setType(e.target.value)} value={type} className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent'>
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                            <option value="video">Video</option>
                            <option value="pdf">PDF</option>
                          </select>
                        </div>
                      </div>
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
                    </div>
                  case 2:
                    return <div>
                      <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Course Fee</label>
                        <input onChange={e => setFee(parseInt(e.target.value))} value={fee} type="number" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                        <p className='text-xs'>Set course fee to 0 for a free course</p>
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
                  {active === 2 ? <button onClick={() => add()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>{loading ? "Loading..." : "Add Course"}</button> : <button onClick={() => setActive(active + 1)} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'>Next</button>}
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

export default AddCourse;