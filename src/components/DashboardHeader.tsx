import { useAppSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { Dropdown, notification } from "antd";
import Notification from "./modals/Notification";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { NoticeType } from "@/types/ResourceType";
import ImageViewer from "./ImageViewer";
import apiService from "@/utils/apiService";
import Link from "next/link";
import { isActionChecked } from "@/utils/checkPrivilege";

const DashboardHeader = ({ setToggle }: { setToggle: () => void }) => {
  const user = useAppSelector((state) => state.value);
  const [dbUser, setDBUser] = useState<
    { premiumPlan: string; profilePicture?: string } | undefined
  >();
  const dispatch = useAppDispatch();
  const [notice, setNotice] = useState<NoticeType | null>();
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const getUser = () => {
    apiService.get(`user/profile/${user.id}`).then(function (response) {
      setDBUser(response.data.user);
    });
  };

  useEffect(() => {
    console.log(user);
  }, [user]);
  const getNotice = () => {
    apiService
      .get(`notice/${user.id}`)
      .then(function (response) {
        console.log(response.data);
        setNotice(response.data.notice.reverse()[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getNotice();
    getUser();
  }, []);

  const markRead = () => {
    apiService
      .put(`notice/enroll/${notice?._id}`, {
        id: user.id,
      })
      .then(function (response) {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const takeAction = () => {
    if (notice?.page === "Survey") {
      markRead();
      router.push(`/auth/survey?user=${user.id}`);
    } else {
      markRead();
      router.push(
        `/${
          user.role === "student" ? "applicant" : "tutor"
        }/${notice?.page.toLowerCase()}`
      );
    }
  };

  const logout = async () => {
    localStorage.clear();
    api.open({
      message: "Logged out Successfully!",
    });
    window.location.href = "/auth/login";
  };

  const changeRole = () => {
    const person = { ...user, role: "student" };
    // person.role = "tutor"
    dispatch(setUser(person));
    window.location.reload();
  };
  const items: MenuProps["items"] = [
    ...[
      user.role === "tutor"
        ? {
            key: "1",
            label: (
              <p
                onClick={() => {
                  if (
                    isActionChecked(
                      "Switch Roles to Student platform of the Training Provider",
                      user.privileges
                    )
                  ) {
                    changeRole();
                  }
                }}
              >
                Switch Roles
              </p>
            ),
          }
        : null,
    ],
    {
      key: "2",
      label: (
        <Link
          onClick={(e) => {
            if (!isActionChecked("View Profile Details", user.privileges)) {
              e.preventDefault(); // Prevent navigation if the user lacks permission
              // alert("You do not have permission to view the profile.");
            }
          }}
          href={`/${user.role === "student" ? "applicant" : user.role}/profile`}
        >
          <p>Settings</p>
        </Link>
      ),
    },

    ...[
      user.role !== "admin"
        ? {
            key: "3",
            label: (
              <Link
                onClick={(e) => {
                  if (!isActionChecked("View Wallet", user.privileges)) {
                    e.preventDefault(); // Prevent navigation if the user lacks permission
                    // alert("You do not have permission to View Wallet.");
                  }
                }}
                href={`/${
                  user.role === "student" ? "applicant" : user.role
                }/wallet`}
              >
                <p>Wallet</p>
              </Link>
            ),
          }
        : null,
    ],
    ...[
      user.role === "tutor"
        ? {
            key: "4",
            label: (
              <Link href={`/tutor/plans`}>
                <p>Your Plan</p>
              </Link>
            ),
          }
        : null,
    ],

    {
      key: "5",
      label: <p onClick={() => logout()}>Logout</p>,
    },
  ];

  return (
    <section className="fixed lg:w-[80%] w-full bg-[#F8F7F4]">
      <div className="p-4 z-50 flex justify-between shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38]">
        <div className="lg:hidden block my-auto">
          <img
            onClick={() => setToggle()}
            src="/images/hamburger.png"
            className="w-8 h-8 my-auto"
            alt=""
          />
        </div>
        <div className={"lg:flex hidden lg:w-[45%]  my-auto justify-between"}>
          {/* <Link href={"/#courses"}>
            <p className="my-auto">Find Experts</p>
          </Link> */}
          <a
            className="text-center flex items-center sm:my-auto flex-col gap-2"
            href={`https://www.experthubllc.com/feeds?tid=${user.accessToken}`}
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-house"
              viewBox="0 0 16 16"
            >
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
            </svg> */}
            <p className="sm:hidden">Home</p>
          </a>
          <Link className="my-auto" href={"https://www.experthubllc.com/home#workspace"}>
            <p className="my-auto">Workspace</p>
          </Link>
          <Link className="my-auto" href={"https://www.experthubllc.com/home#training"}>
            <p className="my-auto">Trainings</p>
          </Link>
          <Link className="my-auto" href={"https://www.experthubllc.com/home#events"}>
            <p className="my-auto">Events</p>
          </Link>
        </div>
        {/* <div className='flex'>
          <div className='mr-20 sm:hidden'>
            <p className='font-medium'>Welcome</p>
            <p className='font-bold capitalize'>{user.fullName}</p>
          </div>
          <div className='flex gap-8 justify-between'>

            <a className='text-center flex items-center sm:my-auto flex-col gap-2' href={`https://www.experthubllc.com/feeds?tid=${user.accessToken}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
              </svg>
              <p className='sm:hidden text-[15px]'>Home</p>

            </a>


            <a className='text-center flex items-center flex-col gap-2  sm:my-auto' href={`https://www.experthubllc.com/user?page=${user.id}&tid=${user.accessToken}`} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>

              <p className='sm:hidden text-[15px]'>My Business</p>

            </a>
            <Link className='text-center sm:my-auto flex items-center flex-col gap-2  ' href={user.role === 'admin' ? `admin/startup-kit` : `applicant/startup-kit`} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
              </svg>
              <p className='sm:hidden text-[15px]'>Start-up Kit </p>

            </Link>

            <a className='text-center sm:my-auto flex items-center flex-col gap-2 ' href="https://project.experthubllc.com/" target='_blank'>
              <img src="/images/project.png" className='lg:w-5 sm:w-8 my-auto sm:h-8 mx-auto' alt="" /> 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi mx-autobi-journal-text" viewBox="0 0 16 16">
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
              </svg>
              <p className='sm:hidden text-[15px]'>Project Manager</p>
            </a>
            {((user.role === 'admin' || user.role === 'tutor') && ((dbUser?.premiumPlan !== "basic"))) ? <Link className='sm:my-auto' href={'/tutor/team'}>
              <div className='text-center flex items-center flex-col gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                </svg>
                <p className='sm:hidden text-[15px]'>Add Team</p>
              </div>
            </Link> : null}
          </div>
        </div> */}

        {/* <div className='sm:hidden w-[30%] relative'>
          <input type="text" className='pl-10 p-2 w-full rounded-md border border-[#1E1E1E8A] bg-transparent' placeholder='Search courses, trainer, test etc' />
          <img className='absolute top-2 w-6 left-2' src="/images/icons/search.svg" alt="" />
        </div> */}

        <div className="flex lg:w-28 w-24 justify-between">
          {/* {user.role !== 'admin' && <Link href={`${user.role === 'student' ? '/applicant' : user.role}/wallet`}>
            <button className="text-[20px] shadow-md rounded-full p-4 relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-wallet2"
                viewBox="0 0 16 16"
              >
                <path d="M12.136.326A1.5 1.5 0 0 1 14 1.78V3h.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9a1.5 1.5 0 0 1 1.432-1.499zM5.562 3H13V1.78a.5.5 0 0 0-.621-.484zM1.5 4a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
              </svg>
            </button>
          </Link>} */}
          <Notification />
          <Dropdown menu={{ items }} trigger={["click"]}>
            <img
              className="h-10 w-10 rounded-full my-auto object-cover"
              src={
                dbUser?.profilePicture
                  ? dbUser.profilePicture
                  : "/images/user.png"
              }
              alt=""
            />
          </Dropdown>
          {/* <button onClick={() => logout()} className="text-[20px] shadow-md rounded-full p-4 relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="red"
              className="bi bi-box-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
              />
              <path
                fillRule="evenodd"
                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
              />
            </svg>
          </button> */}
        </div>

        {notice && show && (
          <div>
            <div className="fixed bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10"></div>
            <div className="fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[40%] h-[70vh] w-[95%] mx-auto z-20 bg-[#F8F7F4]">
              <div className="shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12">
                <p className="font-medium text-center">{notice.title}</p>
                {/* <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" /> */}
              </div>
              <div className="p-4">
                {notice.thumbnail && <ImageViewer image={notice.thumbnail} />}
              </div>
              <div className="lg:mx-12 mx-4 my-4">
                <p>{notice.body}</p>
                <div className="text-center ">
                  <button
                    onClick={() => takeAction()}
                    className="bg-[#F7A607] text-white p-1 rounded-md my-3 px-6"
                  >
                    {notice.action}
                  </button>{" "}
                  <br />
                  {notice.cancel ? (
                    <button onClick={() => setShow(false)} className="p-1">
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DashboardHeader;
