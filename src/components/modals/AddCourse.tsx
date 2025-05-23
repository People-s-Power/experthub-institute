"use client"

import type React from "react"
import { type ChangeEvent, type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { CategoryType, CourseType } from "@/types/CourseType"
import { notification } from "antd"
import Select from "react-select"
import type { UserType } from "@/types/UserType"
import { Spin } from "antd"
import apiService from "@/utils/apiService"
import Play from "../icons/play"
import Pause from "../icons/pause"
import Video from "../icons/video"
import type { AxiosProgressEvent } from "axios"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import utc from "dayjs/plugin/utc"

import advancedFormat from "dayjs/plugin/advancedFormat"
import SelectCourseDate from "../date-time-pickers/SelectCourseDate"
import SheduledCourse from "../date-time-pickers/ScheduledCourse"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { jwtDecode } from "jwt-decode"
import { setUser } from "@/store/slices/userSlice"
import { Trash, Trash2 } from "lucide-react"
import { isActionChecked } from "@/utils/checkPrivilege"

dayjs.extend(isBetween)
dayjs.extend(utc)
dayjs.extend(advancedFormat)

const AddCourse = ({
  open,
  handleClick,
  setOpen,
  course,
  setShowPremium,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleClick: any
  course: CourseType | null
  setShowPremium?: Dispatch<SetStateAction<boolean>>
}) => {
  const user = useAppSelector((state) => state.value)
  // const { zoomUser } = useZoom()

  const uploadRef = useRef<HTMLInputElement>(null)
  const pdfUploadRef = useRef<HTMLInputElement>(null)
  const [api, contextHolder] = notification.useNotification()
  const [active, setActive] = useState(0)
  const [about, setAbout] = useState(course?.about || "")
  const [startDate, setStartDate] = useState(course?.startDate || undefined)
  const [endDate, setEndDate] = useState(course?.endDate || undefined)
  const [startTime, setStartTime] = useState(course?.startTime || undefined)
  const [endTime, setEndTime] = useState(course?.endTime || undefined)
  const [striked, setStriked] = useState<number>(course?.strikedFee || 0)
  const [fee, setFee] = useState<number>(course?.fee || 0)
  const [duration, setDuration] = useState<number>(course?.duration || 0)
  const [category, setCategory] = useState(course?.category || "")
  const [categoryIndex, setCategoryIndex] = useState("")
  const [resources, setResource] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [fileName, setFileName] = useState("")

  const [liveCourses, setLiveCourses] = useState([])
  const [courseDuration, setCourseDuration] = useState<number>(course?.daration || 0)
  const [timeframe, setTimeframe] = useState("days")

  const [userProfile, setUserProfile] = useState<any>()

  const [privacy, setPrivacy] = useState(course?.privacy || "")
  const [type, setType] = useState(course?.type || "offline")
  const [title, setTitle] = useState(course?.title || "")
  const [image, setImage] = useState<any>(course?.thumbnail || null)
  const [location, setLocation] = useState(course?.loaction || "")
  const [target, setTarget] = useState(course?.target || 0)
  const [courseColor, setCourseColor] = useState(course?.primaryColor || "#3B82F6")

  const [room, setRoom] = useState(course?.room || "")
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<{ label: string; value: string }[]>([])
  const [myStudents, setMyStudents] = useState<{ id: string; fullname: string }[]>([])
  const router = useRouter()
  const [scholarship, setScholarship] = useState([])
  const [audience, setAudience] = useState([])
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const pathname = usePathname()

  const [pdf, setPdf] = useState("")

  const module = {
    title: "",
    description: "",
  }

  const defaultVideoLayout = {
    title: "",
    videoUrl: "",
    video: null,
    duration: 0,
    submodules: [],
  }

  const defaultSubmoduleLayout = {
    title: "",
    videoUrl: "",
    duration: 0,
    video: null,
  }

  const [videos, setVideos] = useState(course?.videos || [defaultVideoLayout])
  const [uploadedCount, setUploadedCount] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [instant, setInstant] = useState(true)
  const [meetingPlatform, setMeetingPlatform] = useState("zoom")

  const [categories, setCategories] = useState<CategoryType[]>([])

  const [modules, setModules] = useState(course?.modules || [module])
  const [benefits, setBenefits] = useState(course?.benefits || [""])
  const [days, setDays] = useState(
    course?.days || [
      {
        day: "Monday",
        startTime: "",
        endTime: "",
        checked: false,
      },
      {
        day: "Tuesday",
        startTime: "",
        endTime: "",
        checked: false,
      },
      {
        day: "Wednesday",
        startTime: "",
        endTime: "",
        checked: false,
      },
      {
        day: "Thursday",
        startTime: "",
        endTime: "",
        checked: false,
      },
      {
        day: "Friday",
        startTime: "",
        endTime: "",
        checked: false,
      },
      {
        day: "Saturday",
        startTime: "",
        endTime: "",
        checked: false,
      },
    ],
  )
  function formatDuration(seconds: number): string {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const paddedMins = mins.toString().padStart(2, "0")
    const paddedSecs = secs.toString().padStart(2, "0")

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${paddedMins}:${paddedSecs}`
    } else {
      return `${paddedMins}:${paddedSecs}`
    }
  }

  // Load saved course data from localStorage when component mounts or when open changes
  useEffect(() => {
    if (open) {
      const storedData = localStorage.getItem("pendingCourseData")
      const open = localStorage.getItem("openCreate")
      if (open) {
        setActive(1)
        setMeetingPlatform("google")
        setType("online")
        localStorage.removeItem("openCreate")
      }
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          console.log(parsedData, "data from localstorage hee rgotren")

          // Set all form fields from localStorage data
          setTitle(parsedData.title || "")
          setAbout(parsedData.about || "")
          setBenefits(parsedData.benefits || [""])
          setModules(parsedData.modules || [module])
          setCategory(parsedData.category || "")
          setInstant(parsedData.instant === "true" ? true : false)
          setImage(parsedData.image || null)
          setStartDate(parsedData.startDate || undefined)
          setEndDate(parsedData.endDate || undefined)
          setStartTime(parsedData.startTime || undefined)
          setEndTime(parsedData.endTime || undefined)
          setDays(parsedData.days || days)
          setDuration(parsedData.duration || 0)
          setType(parsedData.type || "offline")
          setPrivacy(parsedData.privacy || "")
          setFee(parsedData.fee || 0)
          setStriked(parsedData.strikedFee || 0)
          setRoom(parsedData.room || "")
          setLocation(parsedData.location || "")
          setMeetingPlatform(parsedData.meetingType || "zoom")
          setCourseDuration(parsedData.courseDuration || 0)
          setTimeframe(parsedData.timeframe || "days")
          setCourseColor(parsedData.courseColor || "#3B82F6")

          // Set active tab to the last one (Modules)
          setActive(3)
        } catch (error) {
          console.error("Error parsing pending course data", error)
        }
      }
    }
  }, [open])

  const UncheckAllDays = () => {
    setDays(
      days.map((day: any) => {
        return { ...day, checked: false, startTime: "", endTime: "" }
      }),
    )
  }
  const clearInfo = () => {
    setStartTime(undefined)
    setStartDate(undefined)
    setEndTime(undefined)
    setEndDate(undefined)
  }

  const [playingIndex, setPlayingIndex] = useState<string | null>(null)

  const handlePlayClick = (mainIndex: number, subIndex: number | null = null) => {
    const key = subIndex === null ? `${mainIndex}-main` : `${mainIndex}-${subIndex}`
    const selector = subIndex === null ? `.video-main-${mainIndex}` : `.video-sub-${mainIndex}-${subIndex}`
    const video = document.querySelector(selector) as HTMLVideoElement

    if (video) {
      if (video.paused) {
        video.play()
        setPlayingIndex(key)
      } else {
        video.pause()
        setPlayingIndex(null)
      }
    }
  }

  const uploadSingleVideo = async (
    mainIndex: number,
    subIndex: number | null,
    file: File,
    existingUrl: string,
    totalCount: number,
  ) => {
    if (!file || existingUrl.includes("res.cloudinary.com")) return

    try {
      const { data } = await apiService.get("courses/cloudinary/signed-url")

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", data.apiKey)
      formData.append("timestamp", data.timestamp)
      formData.append("signature", data.signature)

      const { data: dataCloud } = await apiService.post(
        `https://api.cloudinary.com/v1_1/${data.cloudname}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
            setUploadProgress(percent) // For this individual upload
          },
        },
      )

      setUploadedCount((prev) => prev + 1)
      const updated = videos
      if (subIndex === null) {
        updated[mainIndex].videoUrl = dataCloud.secure_url
      } else {
        updated[mainIndex].submodules[subIndex].videoUrl = dataCloud.secure_url
      }
      setVideos(updated)
      return updated
    } catch (e) {
      console.error(e, "from uploader")
      throw e
    }
  }

  const getCategories = () => {
    apiService
      .get("category/all")
      .then((response) => {
        setCategories(response.data.category)
        // use course.catgory which is sub catrgry to get the main catgory
        if (course?.category) {
          const mainCategory = response.data.category.find((cat: any) =>
            cat.subCategory.find((sub: any) => sub === course?.category),
          )

          console.log(mainCategory)

          setCategoryIndex(mainCategory.category)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (
      user.role === "tutor" &&
      e.target.value === "online" &&
      (!userProfile?.premiumPlan || userProfile?.premiumPlan === "basic") &&
      setShowPremium
    ) {
      handleClick()
      setShowPremium(true)
    } else {
      setType(e.target.value)
    }
  }

  const handleModulesInputChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedObjects = [...modules]
    updatedObjects[index] = { ...updatedObjects[index], [field]: value }
    setModules(updatedObjects)
  }

  const handleBenefitsInputChange = (index: number, value: string | number | boolean) => {
    const updatedObjects = [...benefits]
    updatedObjects[index] = value
    setBenefits(updatedObjects)
  }

  const handleDaysInputChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedObjects = [...days]
    if (type === `online`) {
      if (value) {
        const [hours, minutes] =
          value === true ? dayjs(startTime).format(`HH:mm`).split(":") : (value as string).split(":")
        const startDateIn = new Date(
          new Date(dayjs(startDate).toDate()).setHours(Number.parseInt(hours), Number.parseInt(minutes)),
        )
        const endDateIn = new Date()
        endDateIn.setTime(startDateIn.getTime() + (duration || 1) * 60000)
        const endTime = dayjs(endDateIn).format("HH:mm")
        updatedObjects[index] = {
          ...updatedObjects[index],
          startTime: value === true ? startTime : value,
          endTime,
          [field]: value,
        }
        return setDays(updatedObjects)
      } else {
        updatedObjects[index] = { ...updatedObjects[index], startTime: ``, endTime: ``, [field]: value }
        return setDays(updatedObjects)
      }
    }
    updatedObjects[index] = { ...updatedObjects[index], [field]: value }
    return setDays(updatedObjects)
  }

  const handleInputChange = (mainIndex: number, field: string, value: any, subIndex = null) => {
    setVideos((prev) => {
      const updated = [...prev]
      if (subIndex === null) {
        updated[mainIndex][field] = value
      } else {
        updated[mainIndex].submodules[subIndex][field] = value
      }
      return updated
    })
  }

  const handleVideo = (e: React.ChangeEvent<HTMLInputElement>, mainIndex: number, subIndex: number | null = null) => {
    const file = e.target.files?.[0]
    if (!file) return

    const videoUrl = URL.createObjectURL(file)
    const videoElement = document.createElement("video")

    videoElement.preload = "metadata"
    videoElement.src = videoUrl

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration

      setVideos((prev) => {
        const updated = [...prev]
        if (subIndex === null) {
          updated[mainIndex].video = file
          updated[mainIndex].videoUrl = videoUrl
          updated[mainIndex].duration = duration
        } else {
          updated[mainIndex].submodules[subIndex].video = file
          updated[mainIndex].submodules[subIndex].videoUrl = videoUrl
          updated[mainIndex].submodules[subIndex].duration = duration
        }
        return updated
      })

      // //
      // URL.revokeObjectURL(videoUrl);
    }
  }

  const deleteMainVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index))
  }

  const deleteSubmodule = (mainIndex: number, subIndex: number) => {
    setVideos((prev) => {
      const updated = [...prev]
      updated[mainIndex].submodules = updated[mainIndex].submodules.filter((_: any, i: number) => i !== subIndex)
      return updated
    })
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    // setFile(e.target.files)

    const reader = new FileReader()
    if (files && files.length > 0) {
      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          const type = files[0].name.substr(files[0].name.length - 3)
          setImage({
            type: type === "mp4" ? "video" : "image",
            url: reader.result as string,
          })
        }
      }
    }
  }

  const handlePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    const reader = new FileReader()
    if (files && files.length > 0) {
      setFileName(files[0].name)

      reader.readAsDataURL(files[0])
      reader.onloadend = () => {
        if (reader.result) {
          setPdf(reader.result as string)
          // setImage(reader.result as string)
        }
      }
    }
  }

  const getScholarship = () => {
    const arrayOfIds = scholarship.map((object: any) => object.value)
    return arrayOfIds
  }

  const edit = async () => {
    try {
      if (type === "online" && meetingPlatform === "google" && !user.isGoogleLinked) {
        // Save form data to localStorage
        localStorage.setItem(
          "pendingCourseData",
          JSON.stringify({
            title,
            about,
            benefits,
            modules,
            category,
            image,
            startDate,
            endDate,
            instant,
            startTime,
            endTime,
            days,
            duration,
            type,
            privacy,
            fee,
            strikedFee: striked,
            room,
            location,
            meetingType: meetingPlatform,
            courseDuration,
            timeframe,
            scholarship: getScholarship(),
            audience: Array.from(
              new Set(
                audience.flatMap((data: any) => {
                  if (data.value === "students") {
                    return myStudents.map((data2) => data2.id)
                  }
                  return data.value
                }),
              )),
            courseColor,
          }),
        )

        // Redirect to Google sign-in
        console.log(apiService.getUri())

        window.location.href = `${apiService.getUri()}auth/google?link=${user.id}&role=${user.role}&redirectUrl=${pathname}`
        return
      }

      let newVideos
      if (type === "video") {
        const incompleteModules = videos.some(
          (v) =>
            !v.title.trim() ||
            (!v.video && !v.videoUrl) ||
            v.submodules.some((s: any) => !s.title.trim() || (!s.video && !s.videoUrl)),
        )

        if (incompleteModules) {
          setActive(1)

          return api.open({
            type: "error",
            message: "Please remove or complete empty modules or submodules before submitting.",
          })
        }
        setUploading(true)
        setUploadedCount(0)
        setUploadProgress(0)

        const totalCount = videos.length + videos.reduce((count, video) => count + video.submodules.length, 0)

        try {
          for (let i = 0; i < videos.length; i++) {
            const video = videos[i]

            // Upload main video
            newVideos = await uploadSingleVideo(i, null, video.video, video.videoUrl, totalCount)

            // Upload each submodule
            for (let j = 0; j < video.submodules.length; j++) {
              const sub = video.submodules[j]
              newVideos = await uploadSingleVideo(i, j, sub.video, sub.videoUrl, totalCount)
            }
          }

          setUploading(false)
        } catch (e) {
          console.error(e)
          setUploading(false)
          return api.open({
            message: `Something went wrong during video upload`,
          })
        }
      }

      const requiredFields = {
        title,
        about,
        benefits,
        modules,
        category,
        image,
        ...(type === "offline" && { startDate, endDate, startTime, endTime, room, location }),
        ...(type === "online" && {
          startDate,
          endDate,
          ...(instant ? { startTime, endTime } : { days: days.filter((day: any) => day.checked).length }),
        }),
        ...(type === "video" && { videos }),
        ...(type === "pdf" && { pdf }),
      }

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
        .map(([key]) => key)

      if (missingFields.length > 0) {
        return api.open({
          message: `Please fill in the following fields: ${missingFields.join(", ")}`,
        })
      }

      const startDateTime =
        type === "video" || type === "pdf"
          ? dayjs()
          : dayjs.utc(
            `${dayjs(startDate || "").format(`YYYY-MM-DD`)}T${instant ? startTime : days.filter((day: any) => day.checked)[0]?.startTime
            }:00`,
          )
      const endDateTime =
        type === "video" || type === "pdf"
          ? dayjs()
          : dayjs.utc(
            `${dayjs(endDate || "").format(`YYYY-MM-DD`)}T${instant ? endTime : days.filter((day: any) => day.checked)[0]?.endTime
            }:00`,
          )

      const startDateJS = startDateTime.toDate()
      const endDateJS = endDateTime.toDate()

      setLoading(true)

      const streamlinedAudience = Array.from(
        new Set(
          audience.flatMap((data: any) => {
            if (data.value === "students") {
              return myStudents.map((data2) => data2.id)
            }
            return data.value
          }),
        ),
      )

      apiService
        .put(`courses/edit/${course?._id}`, {
          image,
          // asset: image,
          title,
          target,
          about,
          duration: duration.toString(),
          // type,
          startDate: new Date(startDateJS).toISOString(),
          endDate: new Date(endDateJS).toISOString(),
          startTime: startTime,
          endTime: endTime,
          category: category === "" ? categoryIndex : category,
          privacy,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          room,
          modules,
          location,
          videos: newVideos || [],
          pdf,
          days,
          benefits,
          timeframe: {
            value: courseDuration,
            unit: timeframe,
          },
          scholarship: getScholarship(),
          audience: streamlinedAudience,
          meetingType: meetingPlatform,
          primaryColor: courseColor,
        })
        .then((response) => {
          console.log(response.data)
          setLoading(false)
          handleClick()
        })
    } catch (e) {
      console.log(e)
    }
  }
  const handleGoogleLogin = async () => {
    localStorage.setItem("openCreate", "true")
    window.location.href = `${apiService.getUri()}auth/google?link=${user.id}&role=${user.role}&redirectUrl=${pathname}`
    return
  }
  const add = async () => {
    try {
      if (
        type === "online" &&
        meetingPlatform === "google" &&
        !user.isGoogleLinked &&
        isActionChecked("Add and Change Linked Google Account", user.privileges)
      ) {
        // Save form data to localStorage
        localStorage.setItem(
          "pendingCourseData",
          JSON.stringify({
            title,
            about,
            benefits,
            modules,
            category,
            image,
            startDate,
            endDate,
            instant,
            startTime,
            endTime,
            days,
            duration,
            type,
            privacy,
            fee,
            strikedFee: striked,
            room,
            location,
            meetingType: meetingPlatform,
            courseDuration,
            timeframe,
            scholarship: getScholarship(),
            audience: Array.from(
              new Set(
                audience.flatMap((data: any) => {
                  if (data.value === "students") {
                    return myStudents.map((data2) => data2.id)
                  }
                  return data.value
                }),
              ),
            ),
            courseColor,
          }),
        )

        // Redirect to Google sign-in
        console.log(apiService.getUri())

        window.location.href = `${apiService.getUri()}auth/google?link=${user.id}&role=${user.role}&redirectUrl=${pathname}`
        return
      }

      let newVideos
      if (type === "video") {
        const incompleteModules = videos.some(
          (v) => !v.title.trim() || !v.video || v.submodules.some((s: any) => !s.title.trim() || !s.video),
        )

        if (incompleteModules) {
          setActive(1)

          return api.open({
            type: "error",
            message: "Please remove or complete empty modules or submodules before submitting.",
          })
        }
        setUploading(true)
        setUploadedCount(0)
        setUploadProgress(0)

        const totalCount = videos.length + videos.reduce((count, video) => count + video.submodules.length, 0)

        try {
          for (let i = 0; i < videos.length; i++) {
            const video = videos[i]

            // Upload main video
            newVideos = await uploadSingleVideo(i, null, video.video, video.videoUrl, totalCount)

            // Upload each submodule
            for (let j = 0; j < video.submodules.length; j++) {
              const sub = video.submodules[j]
              newVideos = await uploadSingleVideo(i, j, sub.video, sub.videoUrl, totalCount)
            }
          }

          setUploading(false)
        } catch (e) {
          console.error(e)
          setUploading(false)
          return api.open({
            message: `Something went wrong during video upload`,
          })
        }
      }

      if (type === `online` && conflict) {
        setActive(1)
        return api.open({
          message: "You have chosen a disabled time, please check or use another platform",
        })
      }

      const requiredFields = {
        title,
        about,
        benefits,
        modules,
        category,
        image,
        ...(type === "offline" && { startDate, endDate, startTime, endTime, room, location }),
        ...(type === "online" && {
          startDate,
          endDate,
          ...(instant ? { startTime, endTime } : { days: days.filter((day: any) => day.checked).length }),
        }),
        ...(type === "video" && { videos }),
        ...(type === "pdf" && { pdf }),
      }

      const missingFields = Object.entries(requiredFields)
        .filter(([key, value]) => !value || (Array.isArray(value) && value.length === 0))
        .map(([key]) => key)

      if (missingFields.length > 0) {
        return api.open({
          message: `Please fill in the following fields: ${missingFields.join(", ")}`,
        })
      }

      const startDateTime =
        type === "video" || type === "pdf"
          ? dayjs()
          : dayjs.utc(
            `${dayjs(startDate || "").format(`YYYY-MM-DD`)}T${instant ? startTime : days.filter((day: any) => day.checked)[0]?.startTime
            }:00`,
          )
      const endDateTime =
        type === "video" || type === "pdf"
          ? dayjs()
          : dayjs.utc(
            `${dayjs(endDate || "").format(`YYYY-MM-DD`)}T${instant ? endTime : days.filter((day: any) => day.checked)[0]?.endTime
            }:00`,
          )

      const startDateJS = startDateTime.toDate()
      const endDateJS = endDateTime.toDate()

      setLoading(true)

      const streamlinedAudience = Array.from(
        new Set(
          audience.flatMap((data: any) => {
            if (data.value === "students") {
              return myStudents.map((data2) => data2.id)
            }
            return data.value
          }),
        ),
      )
      console.log(streamlinedAudience)
      apiService
        .post(`courses/add-course/${user.id}`, {
          asset: image,
          title,
          target,
          about,
          duration: duration.toString(),
          type,
          startDate: new Date(startDateJS).toISOString(),
          endDate: new Date(endDateJS).toISOString(),
          startTime: startTime,
          endTime: endTime,
          category: category === "" ? categoryIndex : category,
          privacy,
          fee: fee.toString(),
          strikedFee: striked.toString(),
          room,
          modules,
          location,
          videos: newVideos || [],
          pdf,
          days,
          benefits,
          timeframe: {
            value: courseDuration,
            unit: timeframe,
          },
          scholarship: getScholarship(),
          audience: streamlinedAudience,
          meetingType: meetingPlatform,
          primaryColor: courseColor,
        })
        .then((response) => {
          api.open({
            message: "Course successfully created!",
          })
          console.log(response.data)
          setLoading(false)

          // Clear localStorage after successful submission
          localStorage.removeItem("pendingCourseData")
          router.push(`/courses/${response.data.course._id}`)
          handleClick()
        })
        .catch((error) => {
          console.error(error)
          setLoading(false)
          api.open({
            message: error.response?.data?.message || "An error occurred",
          })
          if (error.response?.data?.showPop && setShowPremium) {
            setShowPremium(true)
          }
        })
    } catch (error) {
      console.error(error)
      api.open({
        message: "An unexpected error occurred",
      })
    }
  }

  const getLiveCourses = () => {
    apiService
      .get("courses/live")
      .then((response) => {
        setLiveCourses(response.data)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getMyStudents = () => {
    apiService
      .get(`user/tutorstudents/${user.id}`)
      .then((response) => {
        console.log(response.data.students, "turtor students")
        setMyStudents(response.data.students)
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getStudents = () => {
    apiService
      .get("user/students")
      .then((response) => {
        console.log(response.data.students)
        const formattedStudents = response.data.students.map((option: UserType) => ({
          value: option.studentId,
          label: option.fullname,
        }))
        console.log(formattedStudents)
        setStudents([{ label: "My Students", value: "students" }, ...formattedStudents])

        // Load scholarship and audience data after students are loaded
        const storedData = localStorage.getItem("pendingCourseData")
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData)

            // Set scholarship if available
            if (parsedData.scholarship && parsedData.scholarship.length > 0) {
              const scholarshipOptions = formattedStudents.filter((student: any) =>
                parsedData.scholarship.includes(student.value),
              )
              setScholarship(scholarshipOptions)
            }

            // Set audience if available
            if (parsedData.audience && parsedData.audience.length > 0) {
              const audienceOptions = formattedStudents.filter((student: any) =>
                parsedData.audience.includes(student.value),
              )
              setAudience(audienceOptions)
            }
          } catch (error) {
            console.error("Error setting scholarship/audience data", error)
          }
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getUser = () => {
    apiService.get(`user/profile/${user.id}`).then((response) => {
      setUserProfile(response.data.user)
    })
  }

  useEffect(() => {
    getStudents()
    getCategories()
    getLiveCourses()
    getUser()
    getMyStudents()
    handleGoogleLink()
  }, [])

  const handleGoogleLink = () => {
    // Handle auth redirect with JWT data
    const encodedData = searchParams.get("data")

    if (encodedData) {
      try {
        const decoded: any = jwtDecode(encodedData)

        if (decoded) {
          console.log(decoded)

          dispatch(
            setUser({
              ...user,
              isGoogleLinked: true, // Make sure this is set to true
            }),
          )

          // Clear the URL params without refreshing
          const newUrl = window.location.pathname
          api.open({
            message: "Google account linked successfully, Continue adding course",
            type: "success",
          })
          window.history.replaceState({}, "", newUrl)

          // Check for pending course data and open modal if exists
          const storedData = localStorage.getItem("pendingCourseData") || localStorage.getItem("openCreate")
          if (storedData) {
            setOpen(true)
          }
        }
      } catch (error) {
        console.error("Invalid user data", error)
      }
    }
  }

  const removeBenefits = (targetIndex: any) => {
    const newArray = benefits.filter((item: any, index: any) => index !== targetIndex)
    setBenefits(newArray)
  }

  const removeModules = (targetIndex: any) => {
    const newArray = modules.filter((item: any, index: any) => index !== targetIndex)
    setModules(newArray)
  }

  return open ? (
    <div>
      <div
        onClick={() => handleClick()}
        className="fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-[999999s]"
      ></div>
      <div className="fixed top-10 bottom-10 left-0 overflow-y-auto rounded-lg right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4] shadow-xl">
        <div className="shadow-md p-4 lg:px-12 flex justify-between items-center bg-white rounded-t-lg">
          <p className="font-semibold text-lg">Add Course</p>
          <button
            onClick={() => handleClick()}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <img className="w-5 h-5" src="/images/icons/material-symbols_cancel-outline.svg" alt="Close" />
          </button>
        </div>
        {contextHolder}
        <div className="lg:flex justify-between lg:mx-12 mx-4 my-4">
          <div className="lg:w-[48%]">
            <div>
              <p className="text-sm font-medium my-1">Course Image/Video Overview</p>
              {image ? (
                image.type === "image" ? (
                  <img
                    onClick={() => uploadRef.current?.click()}
                    src={image?.url || "/placeholder.svg"}
                    className="w-full object-cover h-52"
                    alt=""
                  />
                ) : (
                  <video
                    onClick={() => uploadRef.current?.click()}
                    src={image.url}
                    width="500"
                    autoPlay
                    controls
                    className="embed-responsive-item w-full object-cover h-full"
                  >
                    <source src={image.url} type="video/mp4" />
                  </video>
                )
              ) : (
                <button
                  className="border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full"
                  onClick={() => uploadRef.current?.click()}
                >
                  <img src="/images/icons/upload.svg" className="w-8 mx-auto" alt="" />
                  <p> Add course</p>
                </button>
              )}

              {/* {
                (liveCourses.length !== 0 && type === `online`) && <div className='flex flex-col mt-7'>
                  <p className='text-[19px]'> Upcoming courses</p>
                  <span className='text-slate-400'>You cannot create courses within these times</span>
                  <div className='flex flex-col gap-1 overflow-y-auto max-h-[500px] mt-7 '>
                    {
                      liveCourses.map((course: any, i: number) => <div className='flex  items-center  border-b py-2 border-slate-400'>
                        <span className='font-semibold text-ellipsis whitespace-nowrap capitalize w-1/12'>{i + 1})</span>

                        <span className='font-normal text-ellipsis whitespace-nowrap capitalize overflow-hidden  text-left w-5/12'>{course.title}</span>
                        <div className='flex flex-col w-6/12' >
                          <span className='flex'>{dayjs(course.startDate).format('Do MMMM YYYY')} -  {dayjs(course.endDate).format('Do MMMM YYYY')}</span>
                          {
                            course.days.filter((day: any) => day.checked).length === 0 ? <div className='flex items-start gap-2 '>@ {course.startTime} - {course.endTime}</div> : <div className='flex items-start gap-2 '>
                              Every - <span className='text-[14px] flex flex-col'>{course.days.filter((day: any) => day.checked).map((day: any, i: number) => <span>{day.day + ` @ ${day.startTime}-${day.endTime} ${(i + 1 !== course.days.filter((day: any) => day.checked).length) ? `, ` : ``}`}</span>)}</span>

                            </div>
                          }


                        </div>
                      </div>)
                    }

                  </div>
                </div>
              } */}
            </div>
            <div className="flex my-1"></div>
            <input
              onChange={handleImage}
              type="file"
              name="identification"
              ref={uploadRef}
              accept="video/*,image/*"
              hidden
              multiple={false}
            />

            <input
              onChange={handlePdf}
              type="file"
              name="identification"
              accept=".pdf"
              ref={pdfUploadRef}
              hidden
              multiple={false}
            />
            {/* <Dragger {...props}>
              <div className=''>
                <img src="/images/icons/upload.svg" className='mx-auto' alt="" />
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </div>
            </Dragger> */}
          </div>
          <div className="lg:w-[48%]">
            <div className="border-b font-medium flex justify-between border-[#1E1E1E12] mb-4">
              <div
                className={`p-3 cursor-pointer transition-colors ${active === 0 ? "border-b-2 border-primary text-primary" : "hover:bg-gray-50"}`}
                onClick={() => setActive(0)}
              >
                <p>Course Details</p>
              </div>
              <div
                className={`p-3 cursor-pointer transition-colors ${active === 1 ? "border-b-2 border-primary text-primary" : "hover:bg-gray-50"}`}
                onClick={() => setActive(1)}
              >
                <p>Descriptions</p>
              </div>
              <div
                className={`p-3 cursor-pointer transition-colors ${active === 2 ? "border-b-2 border-primary text-primary" : "hover:bg-gray-50"}`}
                onClick={() => setActive(2)}
              >
                <p>Fee</p>
              </div>
              <div
                className={`p-3 cursor-pointer transition-colors ${active === 3 ? "border-b-2 border-primary text-primary" : "hover:bg-gray-50"}`}
                onClick={() => setActive(3)}
              >
                <p>Modules</p>
              </div>
            </div>
            <div>
              {(() => {
                switch (active) {
                  case 0:
                    return (
                      <div>
                        <div className="flex justify-between my-1">
                          <div className="w-full">
                            <label className="text-sm font-medium my-1">Course Category</label>
                            <select
                              onChange={(e) => setCategoryIndex(e.target.value)}
                              value={categoryIndex}
                              className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                            >
                              <option className="hidden" value="">
                                Select Category
                              </option>
                              {categories.map((single, index) => (
                                <option key={index} value={single.category}>
                                  {single.category}
                                </option>
                              ))}
                            </select>
                          </div>
                          {categories.map(
                            (single) =>
                              single.category === categoryIndex &&
                              single.subCategory.length >= 1 && (
                                <div key={single._id} className="w-full ml-3">
                                  <label className="text-sm font-medium my-1">Sub Category</label>
                                  <select
                                    onChange={(e) => setCategory(e.target.value)}
                                    value={category}
                                    className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                  >
                                    <option className="hidden" value="">
                                      Select Sub-Category
                                    </option>
                                    {single.subCategory.map((sub, index) => (
                                      <option key={index} value={sub}>
                                        {sub}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              ),
                          )}
                        </div>
                        <div className="flex justify-between">
                          <div className="w-[48%]">
                            <label className="text-sm font-medium my-1">Course Duration</label>
                            <input
                              onChange={(e) => setCourseDuration(Number.parseInt(e.target.value))}
                              value={courseDuration}
                              type="number"
                              className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                            />
                          </div>
                          <div className="w-[48%]">
                            <label className="text-sm font-medium my-1"> *</label>
                            <select
                              onChange={(e) => setTimeframe(e.target.value)}
                              value={timeframe}
                              className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                            >
                              <option value="days">Days</option>
                              <option value="weeks">Weeks</option>
                              <option value="months">Months</option>
                            </select>
                          </div>
                        </div>
                        <div className="my-1">
                          <label className="text-sm font-medium my-1">Target</label>
                          <input
                            onChange={(e) => setTarget(e.target.value)}
                            value={target}
                            type="text"
                            className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                          />
                        </div>

                        <div className="my-1">
                          <label className="text-sm font-medium my-1">Course title</label>
                          <input
                            onChange={(e) => setTitle(e.target.value)}
                            value={title}
                            type="text"
                            className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                          />
                        </div>
                        <div className="my-1">
                          <label className="text-sm font-medium my-1">Course Primary Colour</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              onChange={(e) => setCourseColor(e.target.value)}
                              value={courseColor}
                              className="h-10 w-10 cursor-pointer rounded border border-[#1E1E1ED9] bg-transparent p-0"
                            />
                            <input
                              type="text"
                              maxLength={7}
                              minLength={7}
                              value={courseColor}
                              onChange={(e) => setCourseColor(e.target.value)}
                              className="flex-1 border rounded-md border-[#1E1E1ED9] p-2 bg-transparent"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                        <div className="my-1">
                          <label className="text-sm font-medium my-1">About course</label>
                          <textarea
                            onChange={(e) => setAbout(e.target.value)}
                            value={about}
                            className="border rounded-md border-[#1E1E1ED9] w-full h-32 p-2 bg-transparent"
                          ></textarea>
                        </div>

                        <div className="my-1">
                          <label className="text-sm font-medium my-1">Course Benefits</label>
                          {benefits.map((single: string, index: any) => (
                            <div className="flex" key={index}>
                              <input
                                onChange={(e) => handleBenefitsInputChange(index, e.target.value)}
                                className="border rounded-md w-full border-[#1E1E1ED9] p-2 my-1 bg-transparent"
                                value={single}
                                type="text"
                              />
                              <div onClick={() => removeBenefits(index)} className="my-auto ml-5 cursor-pointer">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="20"
                                  fill="currentColor"
                                  className="bi bi-trash-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                </svg>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => setBenefits([...benefits, ""])}
                            className="p-2 bg-primary rounded-md mt-2"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    )
                  case 1:
                    return (
                      <div>
                        {/* <div className='my-1'>
                        <label className='text-sm font-medium my-1'>Instructor Name</label>
                        <input onChange={e => setAuthor(e.target.value)} value={author} type="text" className='border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent' />
                      </div> */}
                        <div className="flex justify-between mt-6 my-1">
                          <div className="w-[48%]">
                            <label className="text-sm font-medium my-1 inline-flex items-center">Course type</label>
                            <select
                              onChange={handleTypeChange}
                              value={type}
                              disabled={Boolean(course?.type)}
                              className="border disabled:cursor-not-allowed rounded-md w-full border-[#1E1E1ED9] p-2.5 bg-transparent"
                            >
                              <option value="offline">Offline</option>
                              <option value="online">Live</option>
                              <option value="video">Video</option>
                              <option value="pdf">PDF</option>
                            </select>
                            {type === "pdf" && (
                              <div>
                                <p className="text-sm font-medium my-1">Course Content</p>
                                <button className="w-full flex my-3" onClick={() => pdfUploadRef.current?.click()}>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="#FDC332"
                                    className="bi bi-file-earmark-arrow-up"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M8.5 11.5a.5.5 0 0 1-1 0V7.707L6.354 8.854a.5.5 0 1 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 7.707z" />
                                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                  </svg>
                                  <p className="ml-4 text-sm"> Click to upload</p>
                                </button>
                                <p className="text-sm">{fileName}</p>
                              </div>
                            )}
                            {/* {type === "online" && <>
                            {
                              zoomUser === null ? (
                                <p className="text-red-500 text-sm my-2">
                                  You need to sign in with Zoom to create a live course.
                                  <button onClick={handleZoomLogin} className="text-blue-600 underline">Sign in with Zoom</button>
                                </p>
                              ) : <div className=' text-sm'>
                                Zoom account - <span className='font-medium'>{zoomUser.email}</span>
                                <button onClick={handleZoomLogin} className="text-blue-600 underline flex text-[12px]">Switch Account</button>
                              </div>
                            }

                          </>} */}
                          </div>

                          {type === "online" && (
                            <div className="w-[48%]">
                              <label className="text-sm font-medium my-1 inline-flex items-center gap-1">
                                Class Duration{" "}
                                {type === `online` && meetingPlatform === "zoom" && (
                                  <>
                                    -{" "}
                                    <span className="text-orange-500 leading-3 font-thin text-[12px]">
                                      {process.env.NEXT_PUBLIC_MEETING_DURATION}min max for Live
                                    </span>
                                  </>
                                )}{" "}
                              </label>
                              <input
                                onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                                max={
                                  type === "online"
                                    ? Number.parseFloat(process.env.NEXT_PUBLIC_MEETING_DURATION as string)
                                    : undefined
                                }
                                value={duration}
                                type="number"
                                className="border disabled:cursor-not-allowed rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent "
                              />
                            </div>
                          )}
                        </div>
                        <div className="w-full">
                          <label className="text-sm font-medium my-1">Set Privacy</label>
                          <Select
                            isMulti
                            options={students}
                            value={audience}
                            className="basic-multi-select !border-[1px] !border-[#d3d3d3] [&>div]:!border-black [&>div]:!shadow-none outline-none ring-0  outline-0 rounded-md bg-transparent"
                            classNamePrefix="select"
                            placeholder="Everybody on the platform"
                            onChange={(e: any) => {
                              console.log(e, "valies for audience")
                              setAudience(e)
                            }}
                          />
                        </div>
                        {type === "online" ? (
                          <>
                            <div className="w-full mt-4">
                              <label className="text-sm font-medium my-1">Meeting Platform</label>
                              <select
                                onChange={(e) => setMeetingPlatform(e.target.value)}
                                value={meetingPlatform}
                                className="border rounded-md w-full border-[#1E1E1ED9] p-2.5 bg-transparent"
                              >
                                <option value="zoom">Zoom</option>
                                <option value="google">Google Meet</option>
                              </select>
                              {meetingPlatform === "google" &&
                                (!user.isGoogleLinked
                                  ? isActionChecked("Add and Change Linked Google Account", user.privileges) && (
                                    <p className="text-sm flex items-center gap-2 text-red-500">
                                      Sign in with Google to create a Live Course. Sign In
                                      <button onClick={handleGoogleLogin} className="text-blue-600 underline">
                                        Sign in
                                      </button>
                                    </p>
                                  )
                                  : isActionChecked("Add and Change Linked Google Account", user.privileges) && (
                                    <p className="flex items-center  gap-2">
                                      <span>
                                        Email :{" "}
                                        <span className="font-medium">{userProfile?.gMail || "Connected"}</span>
                                      </span>
                                      <button onClick={handleGoogleLogin} className="text-blue-600 underline">
                                        Change account
                                      </button>
                                    </p>
                                  ))}
                            </div>
                            <div className="flex items-center border-b border-slate-500 my-5 gap-3 px-4">
                              <button
                                onClick={() => {
                                  setInstant(true)
                                  UncheckAllDays()
                                  clearInfo()
                                }}
                                className={`font-medium py-1 px-5 rounded-t-lg duration-300  ${instant ? `bg-primary` : `bg-gray`}`}
                              >
                                One Time Course
                              </button>
                              <button
                                onClick={() => {
                                  setInstant(false)
                                  clearInfo()
                                }}
                                className={`font-medium py-1 px-5 rounded-t-lg duration-300  ${!instant ? `bg-primary` : `bg-gray`}`}
                              >
                                Scheduled Course
                              </button>
                            </div>

                            {instant && (
                              <SelectCourseDate
                                setEndDate={setEndDate}
                                setConflict={setConflict}
                                startDate={startDate}
                                duration={duration}
                                startTime={startTime}
                                endTime={endTime}
                                setStartDate={setStartDate}
                                setStartTime={setStartTime}
                                setEndTime={setEndTime}
                                courses={meetingPlatform === "google" ? [] : liveCourses}
                              />
                            )}
                          </>
                        ) : null}
                        {type === "offline" && (
                          <>
                            <div className="flex justify-between my-1">
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">Start date</label>
                                <input
                                  onChange={(e) => setStartDate(e.target.value)}
                                  value={startDate}
                                  type="date"
                                  min={new Date().toISOString().split("T")[0]}
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">End date</label>
                                <input
                                  onChange={(e) => setEndDate(e.target.value)}
                                  value={endDate}
                                  type="date"
                                  min={new Date().toISOString().split("T")[0]}
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between my-1">
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">Start time</label>
                                <input
                                  onChange={(e) => setStartTime(e.target.value)}
                                  value={startTime}
                                  type="time"
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent "
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">End time</label>
                                <input
                                  onChange={(e) => setEndTime(e.target.value)}
                                  value={endTime}
                                  type="time"
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between my-1">
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">Course Location</label>
                                <input
                                  placeholder="Place where this course will be held"
                                  onChange={(e) => setLocation(e.target.value)}
                                  value={location}
                                  type="text"
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                />
                              </div>
                              <div className="w-[48%]">
                                <label className="text-sm font-medium my-1">Course Room</label>
                                <input
                                  placeholder="Room No."
                                  onChange={(e) => setRoom(e.target.value)}
                                  value={room}
                                  type="text"
                                  className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        {type === "offline" ? (
                          <>
                            <p className="font-medium">Set your weekly hours</p>
                            {days.map(
                              (
                                day: {
                                  checked: boolean | undefined
                                  day:
                                  | string
                                  | number
                                  | boolean
                                  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                                  | Iterable<React.ReactNode>
                                  | React.ReactPortal
                                  | null
                                  | undefined
                                  startTime: string | number | readonly string[] | undefined
                                  endTime: string | number | readonly string[] | undefined
                                },
                                index: any,
                              ) => (
                                <div key={index} className="flex justify-between my-1">
                                  <input
                                    className="cursor-pointer"
                                    onChange={(e) => handleDaysInputChange(index, "checked", e.target.checked)}
                                    checked={day.checked}
                                    type="checkbox"
                                  />
                                  <p className="w-24 my-auto">{day.day}</p>
                                  <input
                                    value={day.startTime}
                                    onChange={(e) => handleDaysInputChange(index, "startTime", e.target.value)}
                                    className={
                                      day.checked === true && day.startTime === ""
                                        ? "py-1 px-2 border border-[#FF0000] rounded-sm disabled:cursor-not-allowed cursor-pointer"
                                        : "py-1 px-2 rounded-sm disabled:cursor-not-allowed cursor-pointer"
                                    }
                                    type="time"
                                  />
                                  <p className="my-auto">-</p>
                                  <input
                                    value={day.endTime}
                                    onChange={(e) => handleDaysInputChange(index, "endTime", e.target.value)}
                                    className={
                                      day.checked === true && day.endTime === ""
                                        ? "py-1  px-2 border border-[#FF0000] rounded-sm disabled:cursor-not-allowed cursor-pointer"
                                        : "py-1 px-2 rounded-sm disabled:cursor-not-allowed cursor-pointer"
                                    }
                                    type="time"
                                  />
                                </div>
                              ),
                            )}
                          </>
                        ) : null}
                        {type === "online" && !instant && (
                          <SheduledCourse
                            allowedEdit={false}
                            conflict={conflict}
                            setConflict={setConflict}
                            duration={duration}
                            courses={meetingPlatform === "google" ? [] : liveCourses}
                            days={days}
                            endDate={endDate}
                            setDays={setDays}
                            setEndDate={setEndDate}
                            startDate={startDate}
                            setStartDate={setStartDate}
                          />
                        )}
                        {type === "video" && (
                          <div className="mt-4 flex flex-col gap-3">
                            <h2 className="font-medium text-[18px] ">Modules</h2>
                            {videos.map((video, index) => (
                              <div key={index} className=" border-b mb-3 pb-6 space-y-4">
                                {/* Main Video */}
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 space-y-2">
                                    <input
                                      value={video.title}
                                      onChange={(e) => handleInputChange(index, "title", e.target.value)}
                                      placeholder=" Module Title"
                                      className="w-full border p-2 rounded-md text-sm border-gray-300"
                                    />
                                    <input
                                      type="file"
                                      hidden
                                      accept="video/*"
                                      id={`main-${index}`}
                                      onChange={(e) => handleVideo(e, index)}
                                    />
                                    <label
                                      htmlFor={`main-${index}`}
                                      className="group block w-[250px] cursor-pointer relative"
                                    >
                                      {video.videoUrl ? (
                                        <div className="relative rounded-lg overflow-hidden">
                                          <video className={`video-main-${index} w-full rounded-md`} width="250">
                                            <source src={video.videoUrl} type="video/mp4" />
                                          </video>
                                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex justify-center items-center">
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault()
                                                handlePlayClick(index)
                                              }}
                                              className="text-white text-3xl"
                                            >
                                              {playingIndex === `${index}-main` ? <Pause /> : <Play />}
                                            </button>
                                          </div>
                                          {!video.videoUrl.startsWith("https") && (
                                            <div className="absolute top-1 right-1 px-2 py-0.5 rounded-[5px] bg-white/50 backdrop-blur-md text-[12px]">
                                              {formatDuration(video.duration)}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                          <Video />
                                          <span>Add Module Video</span>
                                        </div>
                                      )}
                                    </label>
                                  </div>
                                  <button
                                    onClick={() => deleteMainVideo(index)}
                                    className="ml-4 text-red-500 mt-3 hover:text-red-700 text-sm"
                                  >
                                    <Trash className="w-5 h-5" />
                                  </button>
                                </div>

                                {/* Submodules */}
                                <div className="ml-4 pl-4 border-l border-gray-200">
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">Lessons</h4>
                                  {video.submodules.map((sub: any, subIndex: any) => (
                                    <div key={subIndex} className="flex items-start justify-between mb-4">
                                      <div className="space-y-2 w-full">
                                        <input
                                          value={sub.title}
                                          onChange={(e) => handleInputChange(index, "title", e.target.value, subIndex)}
                                          placeholder="Lesson Title"
                                          className="w-full border p-2 rounded-md text-sm border-gray-300"
                                        />
                                        <input
                                          type="file"
                                          hidden
                                          accept="video/*"
                                          id={`sub-${index}-${subIndex}`}
                                          onChange={(e) => handleVideo(e, index, subIndex)}
                                        />
                                        <label
                                          htmlFor={`sub-${index}-${subIndex}`}
                                          className="group block w-[180px] cursor-pointer relative"
                                        >
                                          {sub.videoUrl ? (
                                            <div className="relative rounded-md overflow-hidden">
                                              <video className={`video-sub-${index}-${subIndex} w-full`} width="180">
                                                <source src={sub.videoUrl} type="video/mp4" />
                                              </video>
                                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex justify-center items-center">
                                                <button
                                                  onClick={(e) => {
                                                    e.preventDefault()
                                                    handlePlayClick(index, subIndex)
                                                  }}
                                                  className="text-white text-2xl"
                                                >
                                                  {playingIndex === `${index}-${subIndex}` ? <Pause /> : <Play />}
                                                </button>
                                              </div>
                                              {!sub.videoUrl.startsWith("https") && (
                                                <div className="absolute top-1 right-1 px-2 py-0.5 rounded-[5px] bg-white/50 backdrop-blur-md text-[12px]">
                                                  {formatDuration(sub.duration)}
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                              <Video />
                                              <span>Add Lesson Video</span>
                                            </div>
                                          )}
                                        </label>
                                      </div>
                                      <button
                                        onClick={() => deleteSubmodule(index, subIndex)}
                                        className="ml-4 text-red-400 hover:text-red-600 mt-3 text-sm"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                  <button
                                    className="text-xs text-blue-600 hover:underline"
                                    onClick={() => {
                                      const updated = [...videos]
                                      updated[index].submodules.push({ ...defaultSubmoduleLayout })
                                      setVideos(updated)
                                    }}
                                  >
                                    + Add Lesson
                                  </button>
                                </div>
                              </div>
                            ))}

                            <button
                              className="mt-3 w-fit px-5  py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                              onClick={() => setVideos([...videos, { ...defaultVideoLayout }])}
                            >
                              + Add Module
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  case 2:
                    return (
                      <div>
                        <div className="my-1">
                          <label className="text-sm font-medium my-1">Course Fee</label>
                          <input
                            onChange={(e) => setFee(Number.parseInt(e.target.value))}
                            value={fee}
                            type="number"
                            className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                          />
                          <p className="text-xs">Set course fee to 0 for a free course</p>
                        </div>
                        <div className="my-1">
                          <label className="text-sm font-medium my-1">
                            Who gets this course for free (Scholarship)
                          </label>
                          <Select
                            isMulti
                            options={students}
                            value={scholarship}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={(e: any) => {
                              setScholarship(e)
                            }}
                          />
                        </div>
                        <div className="my-5">
                          <label className="text-sm font-medium my-1">Show striked out original cost fee</label>
                          <input
                            type="number"
                            onChange={(e) => setStriked(Number.parseInt(e.target.value))}
                            value={striked}
                            className="border rounded-md border-[#1E1E1ED9] w-full h-20 p-2 bg-transparent"
                          />
                        </div>
                      </div>
                    )
                  case 3:
                    return (
                      <div>
                        {modules.map((single: any, index: number) => (
                          <div key={index}>
                            <div>
                              <label className="text-sm font-medium my-1">Module {index + 1} Title</label> <br />
                              <div className="flex">
                                <input
                                  onChange={(e) => handleModulesInputChange(index, "title", e.target.value)}
                                  value={single.title}
                                  className=" border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                                  type="text"
                                />
                                <div onClick={() => removeModules(index)} className="my-auto ml-5 cursor-pointer">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    className="bi bi-trash-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium my-1">Module {index + 1} Description</label> <br />
                              <textarea
                                onChange={(e) => handleModulesInputChange(index, "description", e.target.value)}
                                value={single.description}
                                className="h-18 border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                              ></textarea>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => setModules([...modules, module])}
                          className="bg-primary py-2 px-5 rounded-md"
                        >
                          Add
                        </button>
                      </div>
                    )
                  default:
                    return null
                }
              })()}
              <div>
                <p className="text-sm my-4">
                  By uploading you agree that this course is a product of you and not being forged
                  <input className="ml-2" type="checkbox" />
                </p>

                {type === `video` && uploading && (
                  <div className="flex  flex-col mb-5 ">
                    <h3>Video Upload</h3>
                    <div className="mt-3">
                      <div className="w-full bg-gray p-0.5 rounded-md">
                        <div style={{ width: `${uploadProgress}%` }} className="bg-primary h-2 rounded-md"></div>
                      </div>
                      <p className="text-[14px] text-slate-500">
                        Uploaded {uploadedCount} of{" "}
                        {videos.length + videos.reduce((count, video) => count + video.submodules.length, 0)} videos.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex mt-6">
                  {course === null ? (
                    active === 3 ? (
                      <button
                        disabled={uploading}
                        onClick={() => add()}
                        className="p-2.5 bg-primary font-medium w-40 rounded-md text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? <Spin /> : "Add Course"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setActive(active + 1)}
                        className="p-2.5 bg-primary font-medium w-40 rounded-md text-sm hover:opacity-90 transition-opacity"
                      >
                        Next
                      </button>
                    )
                  ) : active === 3 ? (
                    <button
                      onClick={() => edit()}
                      className="p-2.5 bg-primary font-medium w-40 rounded-md text-sm hover:opacity-90 transition-opacity"
                    >
                      {loading ? <Spin /> : "Edit Course"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setActive(active + 1)}
                      className="p-2.5 bg-primary font-medium w-40 rounded-md text-sm hover:opacity-90 transition-opacity"
                    >
                      Next
                    </button>
                  )}
                  <button
                    onClick={() => handleClick()}
                    className="mx-4 px-4 py-2.5 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

export default AddCourse
