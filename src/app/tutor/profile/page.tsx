"use client"

import DashboardLayout from '@/components/DashboardLayout';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import apiService from '@/utils/apiService';
import { isActionChecked } from '@/utils/checkPrivilege';
import ThirdPartyManagement from './third-party';
import CancelPlanModal from './CancelPlanModal';

const Profile = () => {
  const user = useAppSelector((state) => state.value);
  const uploadRef = useRef<HTMLInputElement>(null);
  const signRef = useRef<HTMLInputElement>(null);

  // Form states
  const [phone, setPhone] = useState("");
  const [skill, setSkill] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>();
  const [signature, setSignature] = useState<string | null>(null);

  // Bank account states
  const [banks, setBanks] = useState<any[]>([]);
  const [bankCode, setCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState("");

  // Loading states
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBank, setLoadingBank] = useState(false);
  const [orgUrl, setOrgUrl] = useState("");

  // File states
  const [file, setFile] = useState<FileList | null>();
  const [sign, setSign] = useState<FileList | null>();

  // User data
  const [userData, setUserData] = useState<any>();

  // Notification state
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  } | null>(null);

  // Plan cancellation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const getBanks = () => {
    apiService.get(`transactions/banks`)
      .then(function (response) {
        setBanks(response.data.data);
      })
      .catch(error => {
        console.error("Failed to fetch banks:", error);
        showNotification("Failed to fetch banks", "error");
      });
  };

  const verifyAccount = (code: string) => {
    if (!accountNumber || !code) return;

    try {
      setLoading(true);
      apiService.put(`transactions/verify-account`, {
        accountNumber,
        bankCode: code
      })
        .then(function (response) {
          setCode(code);
          setAccountName(response.data.data);
        })
        .catch(error => {
          console.error("Account verification failed:", error);
          showNotification("Account verification failed", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  const createRecipient = () => {
    if (!accountName || !accountNumber || !bankCode) {
      showNotification("Please fill in all bank account fields", "error");
      return;
    }

    try {
      setLoadingBank(true);
      apiService.post(`transactions/create-recipient`, {
        accountNumber,
        bankCode,
        userId: user.id
      })
        .then(function (response) {
          showNotification(response.data.message, "success");
        })
        .catch(err => {
          showNotification(err.response?.data || "Failed to update bank account", "error");
        })
        .finally(() => {
          setLoadingBank(false);
        });
    } catch (e) {
      console.error(e);
      setLoadingBank(false);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setFile(files);

    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        if (reader.result) {
          setProfilePicture(reader.result as string);
        }
      };
    }
  };

  const handleSign = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSign(files);

    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        if (reader.result) {
          setSignature(reader.result as string);
        }
      };
    }
  };

  const getUser = () => {
    apiService.get(`user/profile/${user.id}`)
      .then(function (response) {
        const userData = response.data.user;
        setPhone(userData.phone || "");
        setSkill(userData.skillLevel || "");
        setAge(userData.age || "");
        setGender(userData.gender || "");
        setState(userData.state || "");
        setCountry(userData.country || "");
        setProfilePicture(userData.profilePicture);
        setAccountNumber(userData.accountNumber || "");
        setCode(userData.bankCode || "");
        setSignature(userData.signature);
        setOrgUrl(userData.orgUrl)
        setUserData(userData);
      })
      .catch(error => {
        console.error("Failed to fetch user profile:", error);
        showNotification("Failed to fetch user profile", "error");
      });
  };

  const addPic = () => {
    if (!file || file.length === 0) {
      showNotification("Please select an image first", "error");
      return;
    }

    setEditing(true);
    const formData = new FormData();
    formData.append("image", file[0]);

    try {
      apiService.put(`user/updateProfilePicture/${user.id}`, formData)
        .then(function (response) {
          getUser();
          showNotification("Profile picture updated successfully", "success");
        })
        .catch(error => {
          console.error("Failed to update profile picture:", error);
          showNotification("Failed to update profile picture", "error");
        })
        .finally(() => {
          setEditing(false);
        });
    } catch (e) {
      console.error(e);
      setEditing(false);
    }
  };

  const addSign = () => {
    if (!sign || sign.length === 0) {
      showNotification("Please select a signature image first", "error");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", sign[0]);

    try {
      apiService.put(`user/signature/${user.id}`, formData)
        .then(function (response) {
          getUser();
          showNotification("Signature updated successfully", "success");
        })
        .catch(error => {
          console.error("Failed to update signature:", error);
          showNotification("Failed to update signature", "error");
        })
        .finally(() => {
          setUploading(false);
        });
    } catch (e) {
      console.error(e);
      setUploading(false);
    }
  };

  const updateUser = () => {
    setUpdating(true);
    try {
      console.log(orgUrl, 'org');

      apiService.put(`user/updateProfile/${user.id}`, {
        phone,
        gender,
        age,
        skillLevel: skill,
        country,
        orgUrl,
        state
      })
        .then(function (response) {
          getUser();
          showNotification("Profile updated successfully", "success");
        })
        .catch(error => {
          console.error("Failed to update profile:", error);
          showNotification("Failed to update profile", "error");
        })
        .finally(() => {
          setUpdating(false);
        });
    } catch (e) {
      console.error(e);
      setUpdating(false);
    }
  };

  const handleCancelPlan = () => {
    setCancelLoading(true);
    apiService.post(`transactions/cancel-premium/${user.id}`)
      .then(response => {
        console.log(response);

        showNotification("Your premium plan has been canceled", "success");
        getUser(); // Refresh user data
        setShowCancelModal(false);
      })
      .catch(error => {
        console.error("Failed to cancel plan:", error);
        showNotification(error.response?.data?.message || "Failed to cancel plan", "error");
      })
      .finally(() => {
        setCancelLoading(false);
      });
  };

  useEffect(() => {
    if (bankCode) {
      verifyAccount(bankCode);
    }
  }, [bankCode, accountNumber]);

  useEffect(() => {
    getBanks();
    getUser();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-6">
            {/* Personal Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div
                      className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 mb-4"
                      onClick={() => {
                        if (isActionChecked("Edit Profile Image", user.privileges)) {
                          uploadRef.current?.click();
                        }
                      }}
                    >
                      <img
                        src={profilePicture || "/images/user.png"}
                        className="w-full h-full object-cover cursor-pointer"
                        alt="Profile"
                      />
                      {isActionChecked("Edit Profile Image", user.privileges) && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full cursor-pointer">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                      )}
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
                  <h3 className="text-lg font-medium text-gray-900">{user.fullName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                  {file && file.length > 0 && (
                    <button
                      onClick={() => {
                        if (isActionChecked("Edit Profile Image", user.privileges)) {
                          addPic();
                        }
                      }}
                      disabled={editing}
                      className="px-4 py-2 bg-primary text-black rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editing ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </div>
                      ) : 'Update Profile Picture'}
                    </button>
                  )}
                </div>
              </div>
            </div>



            {/* Signature Upload */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Signature</h2>
                <div className="flex flex-col items-center">
                  <div
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors mb-4"
                    onClick={() => {
                      if (isActionChecked("Edit Signature", user.privileges)) {
                        signRef.current?.click();
                      }
                    }}
                  >
                    {signature ? (
                      <img
                        src={signature || "/placeholder.svg"}
                        alt="Uploaded Signature"
                        className="max-h-28 max-w-full object-contain"
                      />
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-400 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-500">Click to upload your signature</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 2MB</p>
                      </>
                    )}
                  </div>
                  <input
                    onChange={handleSign}
                    type="file"
                    name="signature"
                    accept="image/*"
                    ref={signRef}
                    hidden
                    multiple={false}
                  />

                  {sign && sign.length > 0 && (
                    <button
                      onClick={() => {
                        if (isActionChecked("Edit Signature", user.privileges)) {
                          addSign();
                        }
                      }}
                      disabled={uploading}
                      className="px-4 py-2 bg-primary text-black rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Uploading...
                        </div>
                      ) : 'Update Signature'}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {userData?.premiumPlan && userData.premiumPlan !== 'basic' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h2>
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Current Plan:</span>
                      <span className="text-sm font-medium capitalize">{userData.premiumPlan}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Billing Cycle:</span>
                      <span className="text-sm font-medium">{userData.isYearly ? 'Yearly' : 'Monthly'}</span>
                    </div>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="mt-2 px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>       {/* Subscription Status */}


          <div className="md:col-span-2">
            {/* Bank Account */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Number
                      </label>
                      <input
                        required
                        onChange={e => setAccountNumber(e.target.value)}
                        value={accountNumber}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                        type="number"
                        name="accountNumber"
                        id="accountNumber"
                      />
                    </div>

                    <div>
                      <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                        Bank
                      </label>
                      <select
                        onChange={e => setCode(e.target.value)}
                        value={bankCode}
                        name="bank"
                        id="bank"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      >
                        <option value="">Select your bank</option>
                        {banks.map((bank: { code: string; name: string }, index: number) => (
                          <option key={index} value={bank.code}>{bank.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
                        Account Name
                      </label>
                      <div className="relative">
                        <input
                          required
                          value={accountName}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm"
                          type="text"
                          name="accountName"
                          id="accountName"
                        />
                        {loading && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      {loading && (
                        <p className="mt-1 text-xs text-gray-500">Verifying account information...</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (isActionChecked("Update Bank Account", user.privileges)) {
                          createRecipient();
                        }
                      }}
                      disabled={loadingBank || !accountName || !accountNumber || !bankCode}
                      className="px-4 py-2 bg-primary text-black rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingBank ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                          Updating...
                        </div>
                      ) : 'Update Account'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      onChange={e => setPhone(e.target.value)}
                      value={phone}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      type="tel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      onChange={e => setGender(e.target.value)}
                      value={gender}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      onChange={e => setAge(e.target.value)}
                      value={age}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      type="number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country of Residence</label>
                    <input
                      onChange={e => setCountry(e.target.value)}
                      value={country}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State of Residence</label>
                    <input
                      onChange={e => setState(e.target.value)}
                      value={state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                      type="text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
                    <select
                      onChange={e => setSkill(e.target.value)}
                      value={skill}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    >
                      <option value="">Select skill level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                </div>
                <div className='border-slate-300 pt-2 mt-5 border-t'>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organisation URL</label>
                  <input
                    onChange={e => setOrgUrl(e.target.value)}
                    value={orgUrl}
                    placeholder='https://yoursite.com'
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                    type="tel"
                  />
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      if (isActionChecked("Edit Basic information", user.privileges)) {
                        updateUser();
                      }
                    }}
                    disabled={updating}
                    className="px-4 py-2 bg-primary text-black rounded-md text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating ? (
                      <div className="flex items-center">
                        <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                        Updating...
                      </div>
                    ) : 'Update Information'}
                  </button>
                </div>
              </div>
            </div>

            {/* Third Party Management */}
            {userData && <ThirdPartyManagement user={userData} />}
          </div>
        </div>

        {/* Cancel Plan Modal */}
        <CancelPlanModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelPlan}
          planName={userData?.premiumPlan || ""}
          isLoading={cancelLoading}
        />
        {notification && (
          <div className={`fixed top-4 right-4 z-[9999] p-4 min-w-[400px] rounded-md shadow-lg max-w-md transition-all duration-300 ${notification.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            } ${notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
              notification.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setNotification(null)}
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
