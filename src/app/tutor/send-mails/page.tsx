"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAppSelector } from "@/store/hooks";
import apiService from "@/utils/apiService";
import { notification } from "antd";
import React, { useEffect, useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
}

const SendMail = () => {
  const user = useAppSelector((state) => state.value);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const getUsers = () => {
    apiService
      .put("user/mystudents", {
        id: user.id,
      })
      .then(function (response) {
        setUsers(response.data.students || []);
        setSelectedUsers([]);
      })
      .catch((error) => {
        console.log(error);
        api.open({
          message: "Tutor does not have any students enrolled",
          type: "warning",
        });
      });
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user._id));
    }
  };

  const sendMail = () => {
    if (!subject.trim()) {
      api.open({
        message: "Please enter a subject",
        type: "warning",
      });
      return;
    }

    if (!content.trim()) {
      api.open({
        message: "Please enter mail content",
        type: "warning",
      });
      return;
    }

    if (selectedUsers.length === 0) {
      api.open({
        message: "Please select at least one recipient",
        type: "warning",
      });
      return;
    }

    setLoading(true);

    const selectedEmails = users
      .filter((user) => selectedUsers.includes(user._id))
      .map((user) => user.email);

    apiService
      .post("user/send-mail", {
        emails: selectedEmails,
        subject: subject,
        content: content,
        senderId: user.id,
      })
      .then(function (response) {
        api.open({
          message: "Emails sent successfully!",
          type: "success",
        });
        setSubject("");
        setContent("");
        setSelectedUsers([]);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        api.open({
          message: error.response?.data?.message || "Failed to send emails",
          type: "error",
        });
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      {contextHolder}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Send Mail to Students</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipients Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Students</h2>
              <button
                onClick={selectAllUsers}
                className="text-sm text-primary hover:underline"
              >
                {selectedUsers.length === users.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="mb-4 text-sm text-gray-600">
              {selectedUsers.length} of {users.length} selected
            </div>

            <div className="max-h-96 overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => handleUserSelection(user._id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{user.fullName}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compose Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Compose Mail</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown Editor)
                </label>
                <div data-color-mode="light">
                  <MDEditor
                    value={content}
                    onChange={(val) => setContent(val || "")}
                    preview="edit"
                    hideToolbar={false}
                    // visibleDragBar={false}
                    textareaProps={{
                      placeholder: "Enter your message here...\n\nYou can use markdown formatting:\n# Heading 1\n## Heading 2\n**Bold text**\n*Italic text*\n- Bullet point\n1. Numbered list\n[Link text](https://example.com)\n```code block```",
                      style: { fontSize: 14, lineHeight: 1.5, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }
                    }}
                    height={400}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-gray-500">
                  {content.length} characters
                </div>
                <button
                  onClick={sendMail}
                  disabled={loading || selectedUsers.length === 0}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                      </svg>
                      Send Email
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SendMail;
