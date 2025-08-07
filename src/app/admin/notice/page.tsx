"use client";

import DashboardLayout from "@/components/DashboardLayout";
import React, { useState, useEffect } from "react";
import apiService from "@/utils/apiService";
import { useAppSelector } from "@/store/hooks";
import { notification, Popconfirm, Spin, Table, Tag } from "antd";
import { format } from "date-fns";
import Notice from "@/components/modals/Notice";

interface NoticeItem {
  _id: string;
  title: string;
  body: string;
  role: string;
  category?: string;
  country?: string;
  state?: string;
  link?: string;
  page?: string;
  cancel?: boolean;
  action?: string;
  thumbnail?: {
    type: string;
    url: string;
  };
  receivers?: Array<{
    _id: string;
    fullName?: string;
    email?: string;
  }>;
  viewed?: Array<{
    _id: string;
    fullName?: string;
    email?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const NoticePage = () => {
  const user = useAppSelector((state) => state.value);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [api, contextHolder] = notification.useNotification();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await apiService.get("notice");
      const filteredNotices = (response.data.notice.reverse() || []).filter(
        (notice: NoticeItem) => notice.title && notice.body
      );
      setNotices(filteredNotices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notices:", error);
      api.open({
        message: "Failed to fetch notices",
        type: "error",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiService.delete(`notice/${id}`);
      api.open({
        message: "Notice deleted successfully",
        type: "success",
      });
      fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
      api.open({
        message: "Failed to delete notice",
        type: "error",
      });
    }
  };

  const handleEdit = (notice: NoticeItem) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const getCategoryColor = (category: string = "") => {
    switch (category.toLowerCase()) {
      case "webinar":
        return "blue";
      case "course":
        return "green";
      case "event":
        return "purple";
      case "assessment":
        return "orange";
      case "admission":
        return "red";
      default:
        return "cyan";
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Message",
      dataIndex: "body", // Use body field instead of message
      key: "body",
      render: (text: string) =>
        text?.length > 50 ? `${text.substring(0, 50)}...` : text,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (category: string) => (
        <Tag color={getCategoryColor(category)}>
          {(category || "General").toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "For",
      dataIndex: "role", // Use role field instead of forWho
      key: "role",
      render: (role: string) => (
        <Tag color="purple">{(role || "all").toUpperCase()}</Tag>
      ),
    },
    {
      title: "Stats",
      key: "stats",
      render: (_: any, record: NoticeItem) => (
        <div className="flex flex-col text-xs">
          <span className="text-gray-600">
            Recipients: {record.receivers?.length || 0}
          </span>
          <span className="text-green-600">
            Views: {record.viewed?.length || 0}
            {record.receivers?.length
              ? ` (${Math.round(
                  ((record.viewed?.length || 0) / record.receivers.length) * 100
                )}%)`
              : ""}
          </span>
        </div>
      ),
    },
    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (date: string) => format(new Date(date), "MMM dd, yyyy HH:mm"),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: NoticeItem) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(record)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <Popconfirm
            title="Are you sure you want to delete this notice?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              className:
                "bg-red-600 hover:bg-red-700 text-white border-red-600",
            }}
            cancelButtonProps={{
              className: "border-gray-300 hover:border-gray-400",
            }}
            placement="topRight"
          >
            <button className="text-red-600 hover:text-red-800">Delete</button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      {contextHolder}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Manage Notices</h1>
            <p className="text-sm text-gray-500">
              Only notices with both title and body content are displayed
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition"
          >
            Create New Notice
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <Table
              dataSource={notices.filter(
                (notice) => notice.title && notice.body
              )}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: "No notices found with complete information",
              }}
            />
          </div>
        )}
      </div>

      {showAddModal && (
        <Notice
          open={showAddModal}
          handleClick={() => {
            setShowAddModal(false);
            fetchNotices(); // Refresh the notices after creating
          }}
          recipient={undefined}
          editMode={false}
        />
      )}

      {showEditModal && selectedNotice && (
        <Notice
          open={showEditModal}
          handleClick={() => {
            setShowEditModal(false);
            setSelectedNotice(null);
            fetchNotices();
          }}
          noticeData={{
            _id: selectedNotice._id,
            title: selectedNotice.title,
            body: selectedNotice.body,
            role: selectedNotice.role,
            country: selectedNotice.country,
            category: selectedNotice.category,
            state: selectedNotice.state,
            link: selectedNotice.link,
            page: selectedNotice.page,
            cancel: selectedNotice.cancel,
            action: selectedNotice.action,
            asset: selectedNotice.thumbnail, // Map thumbnail to asset for the Notice component
          }}
          editMode={true}
        />
      )}
    </DashboardLayout>
  );
};

export default NoticePage;
