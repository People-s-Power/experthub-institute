import { CourseType } from '@/types/CourseType';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAppSelector } from '@/store/hooks';
import { Spin, notification } from 'antd';
import axios from 'axios';
import { Fade, Slide } from '@mui/material';

const CourseDetails = ({ open, handleClick, course, type, call, action }) => {
  const user = useAppSelector((state) => state.value);

  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter()

  const enroll = () => {
    try {
      axios.post(`courses/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          // console.log(response.data)
          call()
          api.open({
            message: 'Enrolled Successfully'
          });
          handleClick()
        })
        .catch(err => {
          api.open({
            message: err.response.data.message
          });
          // console.log(err.response.data.message)
        })
    } catch (e) {
      // console.log(e.response.data.message)
    }
  }



  async function initClient() {
    const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;

    const client = ZoomMtgEmbedded.createClient();

    const { signature } = await getSignature(course.meetingId, (user.role === "applicant" ? 0 : 1));
    const meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({
      leaveUrl: `${window.location.origin}/${user.role}`,
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        video: {
          isResizable: true,
          viewSizes: {
            default: {
              width: (window.innerWidth > 700) ? 900 : 300,
              height: 500,
            },
            ribbon: {
              width: 300,
              height: 500,
            },
          },
        },
      },

    });

    return { client, signature };
  }
  async function getSignature(meetingNumber, role) {
    try {
      const res = await axios.post(`courses/get-zoom-signature`,
        {
          meetingNumber,
          role
        })
      return res.data
    } catch (e) {
      console.log(e);

    }


  }

  async function startMeeting() {
    setLoading(true)
    const { client, signature } = await initClient();
    console.log(signature, user);
    client.join({
      sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID,
      signature,
      meetingNumber: course.meetingId,
      password: course.meetingPassword,
      userName: user.fullName,
      ...(user.role !== "applicant" && user.role !== "student" ? {
        zak: course.zakToken
      } : {}),
    }).then((res) => {
      if (user.role !== "applicant" && user.role !== "student") {
        console.log(user);
        notifyStudents()
      }
      handleClick()
      setLoading(false)


    }).catch((e) => {
      handleClick()
      setLoading(false)
      console.log(e);;
    })





  }
  const enrollEvent = () => {
    try {
      axios.put(`events/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          console.log(response)
          api.open({
            message: response.data.message,
          });
          handleClick()
        })
        .catch(err => {
          api.open({
            message: err.response.data.message
          });
          console.log(err.response.data.message)
        })
    } catch (e) {
      // console.log(e.response.data.message)
    }
  }

  const checkTyoe = () => {
    if (action === "Event") {
      enrollEvent()
    } else (
      enroll()
    )
  }
  const notifyStudents = async () => {
    try {
      await axios.get(`${action.toLowerCase()}s/notify-live/${course._id}`)
    } catch (e) {
      console.log(e)
      api.open({
        message: 'Something went wrong'
      });
    }
  }
  const config = {
    public_key: 'FLWPUBK-8f804b3f0312ef8a78fea192bdb4a5b4-X',
    tx_ref: Date.now(),
    amount: course.fee - course.strikedFee,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      // phone_number: '070********',
      name: user.fullName,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  function insertAtIndex(str, index) {
    // console.log(str.slice(0, index) + `f_auto/fl_attachment:${course.title}/` + str.slice(index))
    return str.slice(0, index) + `fl_attachment/` + str.slice(index);
  }


  const isOn = () => {
    let currentDate = new Date();
    let startTime = new Date(`${course.startDate} ${course.startTime}`);
    let endTime = new Date(`${course.endDate} ${course.endTime}`);

    let isStarted = currentDate >= startTime;
    let isEnded = currentDate > endTime;
    let on = false
    let msg
    if (isStarted && !isEnded) {
      on = true
      msg = "ongoing"
    } else if (!isStarted) {

      msg = "notStarted"

    } else {
      msg = "ended"
    }
    return { on, msg }
  }



  return (
    <>
      <Fade mountOnEnter unmountOnExit in={open} timeout={400}>
        <div>
          {contextHolder}
          <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-[40]'></div>
          <Slide in={open} mountOnEnter unmountOnExit timeout={300}>
            <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[80%] overflow-y-auto w-[95%] mx-auto z-[99999] bg-[#F8F7F4]'>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38]  p-4 lg:px-12 flex justify-between'>
                <p className='font-medium capitalize'>{action} Details</p>
                <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
              </div>
              <div className='py-4 lg:px-10 px-4'>
                <div className='lg:flex justify-between'>
                  <div className='lg:w-[40%]'>
                    <img src={course.thumbnail} className='w-full h-52 object-cover' alt="" />
                    <div className='p-4'>
                      <p className='font-medium text-base'>{course.title}</p>
                      <div className='my-4'>
                        <p className='font-medium'>The {action} includes</p>
                        <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Learning hours</p>
                        </div>
                        {action !== "Event" && <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Course modules/assesments</p>
                        </div>}
                        {action === "Event" ? <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Certificate of participation</p>
                        </div> : <div className='flex my-1'>
                          <img className='h-2 my-auto mr-2 w-2' src="/images/Ellipse.png" alt="" />
                          <p className='text-sm'>Certificate of completion</p>
                        </div>}
                      </div>
                      {
                        type === "view" ? course.type === "online" ? isOn().on ? <button onClick={() => startMeeting()} className='bg-primary p-2 my-3 rounded-md px-8 w-[150px]'>{loading ? <Spin /> : "Join Live"}</button> : null : user.role !== 'student' ?
                          <button onClick={() => router.push(`/${user.role}/${course._id}?page=${course.type}`)} className='bg-primary p-2 my-3 rounded-md px-8'>{course.type}</button> :
                          action === "Event" ? null : <button onClick={() => router.push(`/applicant/${course._id}?page=${course.type}`)} className='bg-primary p-2 my-3 rounded-md px-8'>{course.type}</button>
                          : <button onClick={() => {
                            course.fee - course.strikedFee === 0 ? checkTyoe() : handleFlutterPayment({
                              callback: (response) => {
                                if (action === "Event") {
                                  enrollEvent()
                                } else {
                                  enroll()
                                }
                                console.log(response);
                                closePaymentModal() // this will close the modal programmatically
                              },
                              onClose: () => {
                                console.log("closed")
                              },
                            })
                          }} className='bg-primary p-2 my-3 rounded-md px-8'>{course.type === "pdf" ? "Buy Now" : action === "Event" ? "Book Now" : "Enroll Now"}</button>
                      }
                    </div>
                    {course.type === "offline" && type === "view" ? <div className='text-sm'>
                      <p><span className='font-bold'>Location:</span> {course.location}</p>
                      <p> <span className='font-bold'>Room:</span> {course.room}</p>
                    </div> : null}
                  </div>
                  <div className='lg:w-[58%]'>
                    <p className='text-lg font-bold'>{course.title}</p>
                    {/* <p className='my-2 text-sm font-medium'>This great online course will equip you with the knowledge and basic skills
                needed to design vector graphics using Figma.</p> */}
                    <p className='text-sm'>{course.about}</p>
                    {
                      course.type === "online" &&
                      <>
                        <p className='text-sm mt-4 mb-1 '>Course Info</p>
                        <p className='text-sm'>
                          <span>This meeting {isOn().msg === "ended" ? "was" : "is"} scheduled for {new Date(course?.startDate).toLocaleString('en-US', {
                            day: "numeric",
                            month: "short",
                            weekday: "long",
                          })} {"at " + course.startTime}
                          </span>
                        </p>
                        <div className='flex mt-1 items-center text-sm   text-[#a1a1a1] gap-3'>
                          {isOn().on ? "Meeting is ongoing" : isOn().msg === "ended" ? "This meeting has ended" : <>
                            <span>Starts at {course.startTime}</span>
                            <span className='loader'></span>
                          </>}


                        </div>
                      </>
                    }

                    <div className='text-center'>
                      {type === "view" && course.type === 'pdf' ? <a href={insertAtIndex(course.file, 65)} download target='_blank'> <button className='bg-primary p-1 mx-auto my-3 rounded-md px-8'>Download/Read</button></a> : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

        </div>
      </Fade>

      {/* {
        joinMeeting && <ZoomMeeting setJoinMeeting={setJoinMeeting} joinMeeting={joinMeeting} closeDetail={handleClick} course={course} />
      } */}

      <div className='fixed top-1/2 left-1/2   -translate-x-1/2 -translate-y-1/2 '>
        <div id="meetingSDKElement"></div>

      </div>
    </>

  );
};

export default CourseDetails;