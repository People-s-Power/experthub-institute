import React, { useEffect, useRef, useState } from "react";
import { Spin, notification } from "antd";
import category from "@/app/admin/category/page";
import { CategoryType, ThumbnailType } from "@/types/CourseType";
import apiService from "@/utils/apiService";

interface NoticeData {
  _id?: string;
  title?: string;
  body?: string;
  role?: string;
  country?: string;
  category?: string;
  state?: string;
  link?: string;
  page?: string;
  asset?: ThumbnailType;
  cancel?: boolean;
  triggerPage?: string;
  action?: string;
  recipient?: String;
}

const Notice = ({
  open,
  handleClick,
  recipient,
  editMode = false,
  noticeData,
}: {
  open: boolean;
  handleClick: any;
  recipient?: String;
  editMode?: boolean;
  noticeData?: NoticeData;
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [category, setCategory] = useState(noticeData?.category || "");
  const [loading, setLoading] = useState(false);
  const [categoryIndex, setCategoryIndex] = useState("");
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
    "Federal Capital Territory",
  ];

  const [role, setRole] = useState(noticeData?.role || "student");
  const [state, setState] = useState(noticeData?.state || "");
  const [title, setTitle] = useState(noticeData?.title || "");
  const [description, setDescription] = useState(noticeData?.body || "");
  const [link, setLink] = useState(noticeData?.link || "");
  const [referreed, setRefered] = useState(noticeData?.page || "");
  const [triggerPage, setTriggerPage] = useState(noticeData?.triggerPage || "");
  const [cancel, setCancel] = useState(noticeData?.cancel ? "yes" : "");
  const [action, setAction] = useState(noticeData?.action || "");
  const [image, setImage] = useState<ThumbnailType | undefined>(
    noticeData?.asset
  );
  const [noticeId, setNoticeId] = useState(noticeData?._id || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadRef = useRef<HTMLInputElement>(null);

  const uploadVideo = async (videoFile: File) => {
    try {
      const { data } = await apiService.get("courses/cloudinary/signed-url");
      console.log(data);

      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("api_key", data.apiKey);
      formData.append("timestamp", data.timestamp);
      formData.append("signature", data.signature);

      const { data: dataCloud } = await apiService.post(
        `https://api.cloudinary.com/v1_1/${data.cloudname}/video/upload`,
        formData,
        {
          onUploadProgress: (progressEvent: any) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
      console.log(dataCloud);

      return dataCloud.secure_url;
    } catch (e) {
      console.error(e, `\n from uploader`);
      throw e;
    }
  };

  const handleNotice = async () => {
    if (!title || !description) {
      return api.open({
        message: "Title and description are required!",
        type: "warning",
      });
    }

    setLoading(true);

    try {
      let finalAsset = image;

      // If there's a selected file and it's a video, upload to Cloudinary
      if (selectedFile && image?.type === "video") {
        const videoUrl = await uploadVideo(selectedFile);
        finalAsset = {
          type: "video",
          url: videoUrl,
        };
      }

      const noticePayload = {
        title,
        body: description,
        role,
        country: "nigeria",
        category: category === "" ? categoryIndex : category,
        state,
        link,
        page: referreed,
        triggerPage,
        asset: finalAsset,
        cancel: cancel === "yes" ? true : false,
        action,
        recipient,
      };

      if (editMode && noticeId) {
        // Update existing notice
        const response = await apiService.put(
          `notice/${noticeId}`,
          noticePayload
        );
        console.log(response.data);
        setLoading(false);
        api.open({
          message: "Notice updated successfully!",
          type: "success",
        });
        handleClick();
      } else {
        // Create new notice
        const response = await apiService.post("notice/new", noticePayload);
        console.log(response.data);
        setLoading(false);
        api.open({
          message: "Notice sent out successfully!",
          type: "success",
        });
        handleClick();
      }
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      api.open({
        message: error.response?.data?.message || "Failed to process notice",
        type: "error",
      });
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // Get file extension from the file name
      const fileName = file.name.toLowerCase();
      const fileExtension = fileName.split(".").pop() || "";

      // List of supported video formats
      const videoFormats = [
        "mp4",
        "avi",
        "mov",
        "wmv",
        "flv",
        "webm",
        "mkv",
        "3gp",
        "ogv",
        "asf",
        "f4v",
        "m4v",
        "rm",
        "rmvb",
        "vob",
        "ts",
        "mts",
        "m2ts",
      ];

      // Check if the file is a video or image
      const isVideo = videoFormats.includes(fileExtension);

      if (isVideo) {
        // For videos, store the file and create object URL for preview
        setSelectedFile(file);
        const videoUrl = URL.createObjectURL(file);
        setImage({
          type: "video",
          url: videoUrl,
        });
      } else {
        // For images, use base64 as before
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          if (reader.result) {
            setImage({
              type: "image",
              url: reader.result as string,
            });
          }
        };
        setSelectedFile(null); // Clear selected file for images
      }
    }
  };

  const getCategories = () => {
    apiService
      .get("category/all")
      .then(function (response) {
        // console.log(response.data)
        setCategories(response.data.category);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getCategories();

    // If in edit mode and we have notice data, initialize category index
    if (editMode && noticeData && noticeData.category) {
      // Find the correct category index for the selected category
      const categoryItem = categories.find(
        (cat) =>
          cat.subCategory && cat.subCategory.includes(noticeData.category || "")
      );

      if (categoryItem) {
        setCategoryIndex(categoryItem.category);
      }
    }

    // Cleanup object URLs on unmount
    return () => {
      if (image && image.url.startsWith("blob:")) {
        URL.revokeObjectURL(image.url);
      }
    };
  }, [categories.length]);

  return (
    open && (
      <div>
        <div
          onClick={() => handleClick()}
          className="fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10"
        ></div>
        <div className="fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[40%] w-[95%] mx-auto z-20 bg-[#F8F7F4]">
          <div className="shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between">
            <p className="font-medium">
              {editMode ? "Edit Notice" : "Send Notice"}
            </p>
            <img
              onClick={() => handleClick()}
              className="w-6 h-6 cursor-pointer"
              src="/images/icons/material-symbols_cancel-outline.svg"
              alt=""
            />
          </div>
          {contextHolder}
          <div className="lg:mx-12 mx-4 my-4">
            <div>
              <p className="text-sm font-medium my-1"></p>
              {image ? (
                <div className="relative">
                  {image.type === "image" ? (
                    <img
                      onClick={() => uploadRef.current?.click()}
                      src={image?.url}
                      className="w-full object-cover h-52"
                      alt=""
                    />
                  ) : (
                    <video
                      onClick={() => uploadRef.current?.click()}
                      src={image.url}
                      controls
                      muted
                      className="w-full object-cover h-52 rounded-md"
                      style={{ maxHeight: "208px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  {/* Show upload progress for videos */}
                  {uploadProgress > 0 &&
                    uploadProgress < 100 &&
                    image.type === "video" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                        <div className="text-white text-center">
                          <div className="mb-2">Uploading video...</div>
                          <div className="w-48 bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <div className="mt-1 text-sm">{uploadProgress}%</div>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <button
                  className="border border-[#1E1E1ED9] p-2 my-1 rounded-md font-medium w-full"
                  onClick={() => uploadRef.current?.click()}
                >
                  <img
                    src="/images/icons/upload.svg"
                    className="w-8 mx-auto"
                    alt=""
                  />
                  <p> Add Image/Video</p>
                </button>
              )}
              <input
                onChange={handleImage}
                type="file"
                name="identification"
                ref={uploadRef}
                accept="video/*,image/*,.mp4,.avi,.mov,.wmv,.flv,.webm,.mkv,.3gp,.ogv"
                hidden
                multiple={false}
              />
            </div>
            {recipient ? null : (
              <>
                <div className="my-2">
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                  >
                    <option value="student">Student</option>
                    <option value="tutor">Tutor</option>
                    <option value="all">All Users</option>
                  </select>
                </div>
                {role !== "all" && (
                  <>
                    <div className="w-full my-2">
                      {/* <label className='text-sm font-medium my-2'>Course Category</label> */}
                      <select
                        onChange={(e) => setCategoryIndex(e.target.value)}
                        value={categoryIndex}
                        className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                      >
                        <option className="hidden" value="">
                          Select Course Category
                        </option>
                        {categories.map((single, index) => (
                          <option
                            key={index + single.category}
                            value={single.category}
                          >
                            {single.category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {categories.map(
                      (single) =>
                        single.category === categoryIndex &&
                        single.subCategory.length >= 1 && (
                          <div key={single._id} className="w-full my-2">
                            {/* <label className='text-sm font-medium my-1'>Sub Category</label> */}
                            <select
                              onChange={(e) => setCategory(e.target.value)}
                              value={category}
                              className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                            >
                              <option className="hidden" value="">
                                Select Sub-Category
                              </option>
                              {single.subCategory.map((sub, index) => (
                                <option key={index + sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
                            </select>
                          </div>
                        )
                    )}
                    <div className="my-2">
                      <select
                        onChange={(e) => setState(e.target.value)}
                        className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
                      >
                        <option className="hidden" value="">
                          Select State
                        </option>
                        {states_in_nigeria.map((state, index) => (
                          <option key={index + state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </>
            )}
            <div className="my-2">
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Title"
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              />
            </div>
            <div className="my-2">
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Description"
                className="border rounded-md w-full h-32 border-[#1E1E1ED9] p-2 bg-transparent"
              ></textarea>
            </div>
            <div className="my-2">
              <input
                onChange={(e) => setLink(e.target.value)}
                value={link}
                type="text"
                placeholder="Url/Link"
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              />
            </div>
            <div className="my-2">
              <select
                onChange={(e) => setRefered(e.target.value)}
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              >
                <option value="" className="hidden">
                  Referred Pages
                </option>
                <option value="Courses">Courses</option>
                <option value="Events">Events</option>
                <option value="Admissions">Admissions</option>
                <option value="Assessment">Assessment</option>
                <option value="Profile">Profile</option>
                <option value="Survey">Survey</option>
              </select>
            </div>

            <div className="my-2">
              <select
                onChange={(e) => setTriggerPage(e.target.value)}
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              >
                <option value="" className="hidden">
                  Page to display Notice
                </option>
                <option value="all">All</option>
                <option value="Courses">Courses</option>
                <option value="Events">Events</option>
                <option value="Admissions">Admissions</option>
                <option value="Assessment">Assessment</option>
                <option value="Profile">Profile</option>
              </select>
            </div>

            <div className="my-2">
              <select
                onChange={(e) => setCancel(e.target.value)}
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              >
                <option value="" className="hidden">
                  Do you want to add CANCEL option?
                </option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="my-2">
              <select
                onChange={(e) => setAction(e.target.value)}
                className="border rounded-md w-full border-[#1E1E1ED9] p-2 bg-transparent"
              >
                <option value="" className="hidden">
                  Call to Action
                </option>
                <option value="Book Now">Book Now</option>
                <option value="Call us">Call us</option>
                <option value="Learn More">Learn More</option>
                <option value="Buy Now">Buy Now</option>
                <option value="Email us">Email us</option>
                <option value="Apply Now">Apply Now</option>
                <option value="Enroll Now">Enroll Now</option>
                <option value="Share Now">Share Now</option>
                <option value="View Now">View Now</option>
                <option value="Act Now">Act Now</option>
                <option value="Join Live">Join Live</option>
                <option value="Fill Now">Fill Now</option>
              </select>
            </div>
            <div className="my-3">
              <button
                onClick={() => handleNotice()}
                className="p-3 bg-primary px-6 rounded-md text-white"
              >
                {loading ? <Spin /> : editMode ? "Update" : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Notice;
