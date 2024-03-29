import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useState } from 'react'
import Popover from '@mui/material/Popover';
import Link from 'next/link';
import axios from 'axios';

export function formatDate(date) {
    var now = new Date();
    var difference = now - date;
    var differenceInSeconds = Math.floor(difference / 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    if (differenceInSeconds < 60) {
        return differenceInSeconds + "s ago";
    }
    if (differenceInSeconds < 3600) {
        var minutes = Math.floor(differenceInSeconds / 60);
        return minutes + "min ago";
    }
    if (differenceInSeconds < 86400) {
        var hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}${hours === 1 ? "hr" : "hrs"} ago`;
    }
    if (differenceInSeconds < 604800) {
        var days = Math.floor(differenceInSeconds / 86400);
        if (days === 1) {
            return `Yesterday, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;
        } else {
            return `${days} days ago, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;
        }
    }
    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'long' });

    return `${day} ${month}, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;;
}
export default function Notifications() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notifications, setNotifications] = useState()
    const user = useAppSelector((state) => state.value);
    useEffect(() => {
        if (!notifications) {
            getNotifcations()
        }
    })

    const getNotifcations = () => {

        try {
            axios.get(`notifications/all/${user.id}`)
                .then(function (response) {
                    setNotifications(response.data)
                })
        } catch (e) {
            console.log(e)

        }
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <button aria-describedby={id} className="text-[20px] shadow-md rounded-full px-3" onClick={handleClick}>
                <img src="/images/icons/notification.svg" className='w-[20px] h-[20px]' alt="" />
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    "&& .MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper": {
                        borderRadius: "6px !important"
                    }
                }}
            >
                <div className="mt-2 bg-white  xs:w-[250px] sm:w-[350px] h-[80vh] mainer overflow-y-auto  md:w-[500px] rounded-[15px]  shadow-[0px_0px_14px_6px_#E2E2E240]">
                    <div className="flex items-center p-3 border-b border-[#d9d9d9]">
                        <h2 className="font-bold text-[18px]">Notifications</h2>
                    </div>
                    <div className="flex flex-col ">
                        {
                            (notifications && notifications?.length !== 0) ? notifications?.map(data => <div key={data.id} className="border-b flex items-center  px-3 py-6 gap-4 border-[#d9d9d9] ">


                                <div className="text-darktext flex text-left flex-1">
                                    {data.content}
                                </div>
                                <Link href={'/'} className='text-[#FDC332]'>View</Link>
                                <span className=" text-right text-[#adadad]">{formatDate(new Date(data.createdAt))}</span>


                            </div>) : <div className="text-[#adadad] text-center block w-full py-3">No notifications</div>
                        }  </div>
                </div>
            </Popover>
        </>
    );
}

