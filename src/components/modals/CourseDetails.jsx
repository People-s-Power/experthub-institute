'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAppSelector } from '@/store/hooks';
import { Fade, Slide } from '@mui/material';
import Link from 'next/link';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Components
import ImageViewer from '../ImageViewer';
import PaymentModal from '../modals/PaymentModal';
import WebinarVideo from '../video-component';
import ShareSection from './course-share';

// Services
import apiService from '@/utils/apiService';

// Icons
import { Calendar, Clock, MapPin, Users, Award, BookOpen, FileText, Video, CheckCircle, X, ChevronRight, Download, Share2 } from 'lucide-react';

// Extend dayjs
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);

const CourseDetails = ({ open, handleClick, course, type, call, action }) => {
  const user = useAppSelector((state) => state.value);
  const router = useRouter();

  // State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const [init, setInit] = useState(false);
  const [notification, setNotification] = useState({ message: '', visible: false, type: 'success' });

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, visible: true, type });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 3000);
  };

  // Enroll in course
  const enroll = () => {
    try {
      setLoading(true);
      apiService.post(`courses/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          call();
          showNotification('Enrolled Successfully');
          handleClick();
          router.push("/applicant");
        })
        .catch(err => {
          showNotification(err.response?.data?.message || 'Enrollment failed', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      showNotification('An error occurred', 'error');
    }
  };

  // Initialize Zoom client
  async function initClient() {
    try {
      const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;
      const client = ZoomMtgEmbedded.createClient();

      // Retrieve the signature
      const { signature } = await getSignature(course.meetingId, (user.role === "applicant" ? 0 : 1));

      // Select the SDK element and check if it exists
      const meetingSDKElement = document.getElementById('meetingSDKElement');
      if (!meetingSDKElement) {
        console.error("Meeting SDK element not found.");
        return;
      }

      // Initialize the Zoom client with configuration
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
    } catch (error) {
      console.error("Error initializing Zoom client:", error);
      return {};
    }
  }

  // Get Zoom signature
  async function getSignature(meetingNumber, role) {
    try {
      const res = await apiService.post(`courses/get-zoom-signature`, { meetingNumber, role });
      return res.data;
    } catch (error) {
      console.error("Error fetching signature:", error);
      return {};
    }
  }

  // Start Zoom meeting
  async function startMeeting() {
    try {
      if (course.meetingMode === "google") {
        return router.push(course.meetingLink, { target: '_blank' });
      }

      setLoading(true);

      // Initialize the client and retrieve the signature
      const { client, signature } = await initClient();

      // Check if signature or client failed to initialize
      if (!client || !signature) {
        showNotification("Failed to initialize meeting", "error");
        setLoading(false);
        return;
      }

      // Join the meeting
      await client.join({
        sdkKey: process.env.NEXT_PUBLIC_CLIENT_ID,
        signature,
        meetingNumber: course.meetingId,
        userName: user.fullName,
        password: course.meetingPassword,
        ...(user.role !== "applicant" && user.role !== "student" ? { zak: course.zakToken } : {}),
      }).then(() => {
        setInit(true);
        notifyStudents();
        handleClick();
        setLoading(false);
      }).catch(() => {
        showNotification("Failed to join meeting", "error");
        handleClick();
        setLoading(false);
      });
    } catch (error) {
      showNotification("An error occurred", "error");
      setLoading(false);
    }
  }

  // Enroll in event
  const enrollEvent = () => {
    try {
      setLoading(true);
      apiService.put(`events/enroll/${course._id}`, {
        id: user.id
      })
        .then(function (response) {
          showNotification(response.data.message);
          handleClick();
        })
        .catch(err => {
          showNotification(err.response?.data?.message || 'Enrollment failed', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      setLoading(false);
      showNotification('An error occurred', 'error');
    }
  };

  // Check type and enroll accordingly
  const checkType = () => {
    if (action === "Event") {
      enrollEvent();
    } else {
      enroll();
    }
  };

  // Notify students
  const notifyStudents = async () => {
    try {
      await apiService.get(`${action.toLowerCase()}s/notify-live/${course._id}`);
    } catch (e) {
      showNotification('Failed to notify students', 'error');
    }
  };

  // Flutterwave config
  const config = {
    public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
    tx_ref: Date.now().toString(),
    amount: course.fee,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      name: user.fullName,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  // Insert attachment at index
  function insertAtIndex(str, index) {
    return str.slice(0, index) + `fl_attachment/` + str.slice(index);
  }

  // Pay with wallet
  const payWithWallet = () => {
    apiService.post(`transactions/pay-with`, {
      amount: course.fee,
      userId: user.id
    })
      .then(function (response) {
        showNotification(response.data.message);
        if (response.status === 200) {
          checkType();
          setIsModalOpen(false);
          handleClick();
        }
      })
      .catch(err => {
        setIsModalOpen(false);
        showNotification(err.response?.data || 'Payment failed', 'error');
      });
  };

  // Check if course/event is ongoing
  const isOn = () => {
    const userTimeZone = dayjs.tz.guess();
    const currentDate = dayjs().tz(userTimeZone);
    const startDate = dayjs(course.startDate).tz(userTimeZone).startOf('day');
    const endDate = dayjs(course.endDate).tz(userTimeZone).endOf('day');

    if (currentDate.isAfter(endDate)) return { on: false, msg: 'Meeting period is over' };
    if (!currentDate.isBetween(startDate, endDate)) return { on: false, msg: 'Meeting is out of date range' };

    const activeDays = course?.days?.filter(day => day.checked) || null;

    if (activeDays?.length === 0) {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.endTime}`).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: `${action} is ongoing` };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `${action} has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      } else {
        return { on: false, msg: `${action} has ended, ended at ${meetingEndTime.format('HH:mm')}` };
      }
    }

    const todayMeeting = activeDays?.find(day => day.day === currentDate.format('dddd'));

    if (todayMeeting) {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${todayMeeting.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${todayMeeting.endTime}`).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: `${action} is ongoing` };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `${action} has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      }
    } else if (action === "Event") {
      const meetingStartTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.startTime}`).tz(userTimeZone);
      const meetingEndTime = dayjs(`${currentDate.format('YYYY-MM-DD')}T${course.endTime}`).tz(userTimeZone);

      if (currentDate.isBetween(meetingStartTime, meetingEndTime)) {
        return { on: true, msg: 'Event is ongoing' };
      } else if (currentDate.isBefore(meetingStartTime)) {
        return { on: false, msg: `Event has not started, will start at ${meetingStartTime.format('HH:mm')}` };
      }
    }

    const futureMeetingsMain = [...(course?.days?.filter(day => day.checked) || [])];
    const msg = (
      <div className='flex flex-col'>
        <div>No meeting now. Check out our schedule below:</div>
        <div className="mt-2 space-y-1">
          {futureMeetingsMain.map((day, i) => (
            <div key={i} className='text-slate-600 flex items-center'>
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {day.day}s at {dayjs(`${dayjs().format('YYYY-MM-DD')} ${day.startTime}`, 'YYYY-MM-DD HH:mm').format('hh:mm A')} -
                {dayjs(`${dayjs().format('YYYY-MM-DD')} ${day.endTime}`, 'YYYY-MM-DD HH:mm').format('hh:mm A')}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return { on: false, msg };
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      {/* Notification */}
      {notification.visible && (
        <div className={`fixed top-4 right-4 z-[1002] p-4 rounded-lg shadow-lg max-w-md transition-all duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' :
          'bg-red-50 text-red-800 border-l-4 border-red-500'
          }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <X className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setNotification({ ...notification, visible: false })}
                  className={`inline-flex rounded-md p-1.5 ${notification.type === 'success' ? 'text-green-500 hover:bg-green-100' :
                    'text-red-500 hover:bg-red-100'
                    }`}
                >
                  <span className="sr-only">Dismiss</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Fade mountOnEnter unmountOnExit in={open} timeout={400}>
        <div className="relative">
          {/* Backdrop */}
          <div
            onClick={handleClick}
            className='fixed cursor-pointer bg-black opacity-50 top-0 left-0 right-0 w-full h-screen z-[999]'
          />

          <Slide in={open} mountOnEnter unmountOnExit timeout={300}>
            <div className='fixed z-[1000] top-10 bottom-10 left-0 rounded-lg right-0 lg:w-[85%] overflow-y-auto w-[95%] mx-auto bg-white shadow-2xl'>
              {/* Header */}
              <div className='h-full'>
                <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center'>
                  <h2 className='font-medium text-lg text-gray-800 capitalize'>
                    {(course.instructorId === user.id) ? "Your Sales and Marketing Copy" : `${action} Details`}
                  </h2>
                  <button
                    onClick={handleClick}
                    className='text-gray-500 hover:text-gray-700 focus:outline-none transition-colors'
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Content */}
                <div className='p-6 '>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Left Column */}
                    <div className='lg:col-span-1  h-fit md:sticky top-20'>
                      <div className='bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100'>
                        {/* Course Image */}
                        <div className='aspect-video relative overflow-hidden'>
                          <ImageViewer image={course.thumbnail} />
                        </div>

                        {/* Course Info */}
                        <div className='p-5'>
                          <h3 className='font-medium text-lg text-gray-900 mb-2'>{course.title}</h3>

                          {/* Enrolled Students */}
                          {course.enrolledStudents?.length > 1 && (
                            <div className='flex items-center mb-4'>
                              <div className='flex -space-x-2 mr-2'>
                                {course.enrolledStudents.slice(0, 5).map(student => (
                                  <img
                                    key={student._id}
                                    src={student.profilePicture || '/images/user.png'}
                                    className='w-7 h-7 rounded-full border-2 border-white object-cover'
                                    alt={`Student ${student._id}`}
                                  />
                                ))}
                              </div>
                              <p className='text-sm text-gray-600'>
                                <span className='font-medium'>{course.enrolledStudents.length}+</span> {action === "Event" ? "participants" : "students"} enrolled
                              </p>
                            </div>
                          )}

                          {/* Price */}
                          {course.fee > 0 ? (
                            <div className='mb-4'>
                              <span className='text-2xl font-medium text-gray-900'>{formatPrice(course.fee)}</span>
                            </div>
                          ) : (
                            <div className='mb-4'>
                              <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                                Free
                              </span>
                            </div>
                          )}

                          {/* Course Includes */}
                          <div className='mb-5'>
                            <h4 className='font-medium text-gray-900 mb-3'>The {action} includes:</h4>
                            <ul className='space-y-2'>
                              <li className='flex items-center text-sm text-gray-600'>
                                <Clock className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
                                <span>Learning hours</span>
                              </li>
                              {action !== "Event" && (
                                <li className='flex items-center text-sm text-gray-600'>
                                  <BookOpen className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
                                  <span>Course modules/assessments</span>
                                </li>
                              )}
                              {action !== "Event" && (
                                <li className='flex items-center text-sm text-gray-600'>
                                  <FileText className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
                                  <span>Additional Resources/Materials</span>
                                </li>
                              )}
                              <li className='flex items-center text-sm text-gray-600'>
                                <Award className='h-4 w-4 text-gray-400 mr-2 flex-shrink-0' />
                                <span>Certificate of {action === "Event" ? "participation" : "completion"}</span>
                              </li>
                            </ul>
                          </div>

                          {/* Action Buttons */}
                          <div className='space-y-3'>
                            {type === "view" ? (
                              course.type === "online" ? (
                                <button
                                  onClick={startMeeting}
                                  disabled={loading}
                                  className='w-full bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center'
                                >
                                  {loading ? (
                                    <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                  ) : (
                                    <Video className="h-4 w-4 mr-2" />
                                  )}
                                  Join Live Session
                                </button>
                              ) : user.role !== 'student' ? (
                                <button
                                  onClick={() => router.push(`/${action === "Course" ? "courses" : "event"}/${course._id}?page=${action === "Course" ? "courses" : "event"}`)}
                                  className='w-full bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-4 rounded-md transition-colors'
                                >
                                  View {course.type}
                                </button>
                              ) : action === "Event" ? null : (
                                <button
                                  onClick={() => router.push(`/applicant/${course._id}?page=${course.type}`)}
                                  className='w-full bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-4 rounded-md transition-colors'
                                >
                                  View {course.type}
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => {
                                  if (user.id) {
                                    parseInt(course.fee) === 0 ? checkType() : setIsModalOpen(true);
                                  } else {
                                    router.push(`/auth/signup?enroll=${course._id}`);
                                  }
                                }}
                                disabled={loading}
                                className='w-full bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center'
                              >
                                {loading ? (
                                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {(course.type === "pdf" && parseInt(course.fee) > 0)
                                  ? "Buy Now"
                                  : action === "Event"
                                    ? "Book Now"
                                    : "Enroll Now"
                                }
                              </button>
                            )}

                            <Link
                              href={`/${action === "Course" ? "courses" : "events"}/${course._id}?`}
                              className='w-full flex items-center justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 px-4 rounded-md transition-colors'
                            >
                              View Full Details
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>

                            <div className="mt-4">
                              <ShareSection
                                courseTitle={course.title}
                                courseDescription={course.description}
                                marketLink={`${window.location.origin}/${action === "Course" ? "courses" : "events"}/${course._id}`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Offline Course Location */}
                      {course.type === "offline" && type === "view" && (
                        <div className='mt-6 bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 p-5'>
                          <h4 className='font-medium text-gray-900 mb-3'>Location Details</h4>
                          <div className='space-y-3'>
                            <div className='flex items-start'>
                              <MapPin className='h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0' />
                              <div>
                                <p className='font-medium text-gray-900'>Location</p>
                                <p className='text-gray-600'>{course.location}</p>
                              </div>
                            </div>

                            <div className='flex items-start'>
                              <MapPin className='h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0' />
                              <div>
                                <p className='font-medium text-gray-900'>Room</p>
                                <p className='text-gray-600'>{course.room}</p>
                              </div>
                            </div>

                            {course.days && course.days.some(day => day.checked) && (
                              <div className='mt-4'>
                                <h5 className='font-medium text-gray-900 mb-2'>Weekly Schedule</h5>
                                <div className='bg-gray-50 rounded-md p-3'>
                                  {course.days.map((day, index) => day.checked && (
                                    <div key={index} className='flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0'>
                                      <span className='font-medium text-gray-700'>{day.day}</span>
                                      <span className='text-gray-600 text-sm'>
                                        {day.startTime} - {day.endTime}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className='lg:col-span-2 mb-8 '>
                      {/* Course Title and Description */}
                      <div className='mb-6'>
                        <h1 className='text-2xl font-medium text-gray-900 mb-3'>{course.title}</h1>
                        <p className='text-gray-600 leading-relaxed'>{course.about}</p>
                      </div>

                      {/* Webinar/Online Details */}
                      {(course.type === "webinar" || course.type === "online") && (
                        <div className='bg-gray-50 rounded-lg p-5 mb-6 border border-gray-200'>
                          <h3 className='text-lg font-medium text-gray-900 mb-3'>
                            {course.type === "webinar" ? "Event Details" : "Course Schedule"}
                          </h3>

                          <div className='flex items-center mb-4'>
                            <Calendar className='h-5 w-5 text-gray-500 mr-2' />
                            <div>
                              <span className='text-gray-600'>From </span>
                              <span className='font-medium text-gray-900'>
                                {new Date(course?.startDate).toLocaleString('en-US', {
                                  day: "numeric",
                                  month: "short",
                                  weekday: "long",
                                })}
                              </span>
                              <span className='text-gray-600'> to </span>
                              <span className='font-medium text-gray-900'>
                                {new Date(course?.endDate).toLocaleString('en-US', {
                                  day: "numeric",
                                  month: "short",
                                  weekday: "long",
                                })}
                              </span>
                            </div>
                          </div>

                          <div className={`${isOn().on ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} border rounded-md p-4 mb-4`}>
                            <div className='flex items-center'>
                              <div className={`rounded-full p-1.5 ${isOn().on ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'} mr-3`}>
                                {isOn().on ? <Video className='h-5 w-5' /> : <Clock className='h-5 w-5' />}
                              </div>
                              <div className='text-sm font-medium'>
                                {isOn().msg}
                              </div>
                            </div>
                          </div>

                          {isOn().on && course.type === "webinar" && (
                            <div className="w-full mt-4">
                              <WebinarVideo
                                videoUrl={course.videoUrl}
                                courseId={course._id}
                                isWebinar={course.type === "webinar"}
                                isEnrolled={Boolean(course.enrolledStudents.find((userIn) => userIn._id === user.id))}
                                autoPlay={isOn().on}
                                onClose={handleClick}
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Instructor Info */}
                      {type === 'enroll' && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6'>
                          <h3 className='text-lg font-medium text-gray-900 mb-3'>Instructor</h3>
                          <div className='flex items-center'>
                            <img
                              src={course.instructorImage || '/images/user.png'}
                              alt={course.instructorName}
                              className='w-12 h-12 rounded-full object-cover mr-4'
                            />
                            <div>
                              <h4 className='font-medium text-gray-900'>{course.instructorName}</h4>
                              <p className='text-sm text-gray-500'>Course Tutor</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Course Benefits */}
                      {course.benefits && course.benefits.length > 0 && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6'>
                          <h3 className='text-lg font-medium text-gray-900 mb-4'>What You'll Learn</h3>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
                            {course.benefits.map((benefit, index) => (
                              <div key={index} className='flex'>
                                <div className='flex-shrink-0 mt-1'>
                                  <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center'>
                                    <CheckCircle className='h-3.5 w-3.5 text-primary' />
                                  </div>
                                </div>
                                <p className='ml-3 text-gray-700'>{benefit}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* PDF Download */}
                      {type === "view" && course.type === 'pdf' && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-5 mb-6 text-center'>
                          <h3 className='text-lg font-medium text-gray-900 mb-3'>Course Materials</h3>
                          <p className='text-gray-600 mb-4'>Download the course materials to start learning at your own pace.</p>
                          <a
                            href={insertAtIndex(course.file, 65)}
                            download
                            target='_blank'
                            className='inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-black font-medium py-2.5 px-6 rounded-md transition-colors'
                          >
                            <Download className='h-4 w-4 mr-2' />
                            Download PDF
                          </a>
                        </div>
                      )}

                      {/* Course Modules */}
                      {course.modules && course.modules.length > 0 && (
                        <div className='bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden'>
                          <div className='border-b border-gray-200'>
                            <div className='flex'>
                              <button
                                onClick={() => setActive(0)}
                                className={`px-6 py-3 text-sm font-medium ${active === 0
                                  ? 'text-primary border-b-2 border-primary'
                                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                                  }`}
                              >
                                Course Modules
                              </button>
                              <button
                                onClick={() => setActive(1)}
                                className={`px-6 py-3 text-sm font-medium ${active === 1
                                  ? 'text-primary border-b-2 border-primary'
                                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'
                                  }`}
                              >
                                Course Descriptions
                              </button>
                            </div>
                          </div>

                          <div className='p-5'>
                            {active === 0 ? (
                              <div className='space-y-4'>
                                {course.modules.map((module, index) => (
                                  <div key={index} className='bg-gray-50 rounded-md p-4'>
                                    <div className='flex items-center'>
                                      <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3'>
                                        <span className='text-primary font-medium'>{index + 1}</span>
                                      </div>
                                      <h4 className='font-medium text-gray-900'>{module.title}</h4>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className='space-y-6'>
                                {course.modules.map((module, index) => (
                                  <div key={index}>
                                    <h4 className='font-medium text-gray-900 mb-2'>Module {index + 1}: {module.title}</h4>
                                    <p className='text-gray-600'>{module.description}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>
        </div >
      </Fade >

      {/* Payment Modal */}
      < PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={payWithWallet}
        card={() => handleFlutterPayment({
          callback: (response) => {
            checkType();
            setIsModalOpen(false);
            closePaymentModal();
          },
          onClose: () => { },
        })}
      />

      {/* Zoom SDK Container */}
      {
        init && (
          <div className="fixed inset-0 z-[1001] bg-white">
            <div
              id="meetingSDKElement"
              className="w-full h-full"
            />
          </div>
        )
      }
    </>
  );
};

export default CourseDetails;
