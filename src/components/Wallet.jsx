"use client"

import DashboardLayout from '@/components/DashboardLayout';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Spin, notification } from 'antd';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const Wallet = () => {
  const user = useAppSelector((state) => state.value);
  const [fund, openFund] = useState(false)
  const [balance, setBalance] = useState('')
  const [transactions, setTransactions] = useState([])
  const [recipient, setReicpient] = useState()
  const [openWithdraw, setOpenWithdraw] = useState(false)
  const [openAccountDetails, setOpenAccountDetails] = useState(false)
  const [banks, setBanks] = useState([])
  const [bankCode, setCode] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState("")
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(false)
  const [amount, setAmount] = useState(0)
  const [api, contextHolder] = notification.useNotification();

  const getBalance = () => {
    axios.get(`transactions/balance/${user.id}`)
      .then(function (response) {
        console.log(response.data)
        setTransactions(response.data.transactions)
        setReicpient(response.data.user)
        setBalance(response.data.balance)
      })
  }

  const handleWithdrawal = () => {
    if (recipient?.bankCode !== undefined && recipient?.accountNumber !== undefined) {
      setOpenWithdraw(true)
      return
    }
    setOpenAccountDetails(true)
  }

  const getBanks = () => {
    axios.get(`transactions/banks`)
      .then(function (response) {
        // console.log(response.data)
        setBanks(response.data.data)
      })
  }

  const verifyAccount = (code) => {
    try {
      setLoading(true)
      axios.put(`transactions/verify-account`, {
        accountNumber,
        bankCode: code
      })
        .then(function (response) {
          // console.log(response.data)
          setCode(code)
          setAccountName(response.data.data)
          setLoading(false)
        })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getBalance()
    getBanks()
  }, [])

  const createRecipient = () => {
    try {
      setLoad(true)
      axios.post(`transactions/create-recipient`, {
        accountNumber,
        bankCode,
        userId: user.id
      })
        .then(function (response) {
          // console.log(response.data)
          api.open({
            message: response.data.message
          });
          setLoad(false)
          setOpenAccountDetails(false)
        })
        .catch(err => {
          setLoad(false)
          api.open({
            message: err.response.data
          });
          // console.log(err.response.data.message)
        })
    } catch (e) {
      console.log(e)
    }
  }

  const withdraw = () => {
    try {
      setLoad(true)
      axios.post(`transactions/withdraw`, {
        amount,
        userId: user.id
      })
        .then(function (response) {
          console.log(response.data)
          api.open({
            message: response.data.message
          });
          setLoad(false)
          setOpenWithdraw(false)
        })
        .catch(err => {
          setLoad(false)
          api.open({
            message: err.response.data
          });
          setOpenWithdraw(false)
          // console.log(err.response.data.message)
        })
    } catch (e) {
      console.log(e)
    }
  }
  const config = {
    public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
    tx_ref: Date.now(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      // phone_number: '070********',
      name: user.fullName,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const addFunds = () => {
    try {
      setLoad(true)
      axios.post(`transactions/add-funds`, {
        amount,
        userId: user.id
      })
        .then(function (response) {
          console.log(response.data)
          getBalance()
          api.open({
            message: response.data.message
          });
          setLoad(false)
          openFund(false)
        })
        .catch(err => {
          setLoad(false)
          api.open({
            message: err.response.data
          });
          openFund(false)
          // console.log(err.response.data.message)
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <DashboardLayout>
      {contextHolder}
      <div className='p-6'>
        <div>
          <p>Balance</p>
          <p className='text-3xl'>₦ {balance}</p>
          {user.role === 'tutor' ? <button onClick={() => handleWithdrawal()} className='bg-primary text-white p-3 rounded-md px-10 my-4'>Withdraw</button> : user.role === 'student' ? <button onClick={() => openFund(true)} className='bg-primary text-white p-3 rounded-md px-10 my-4'>Fund</button> : null
          }
        </div>
        <div className=''>
          <div className='border-b py-3 border-[#1E1E1E80]'>
            <p className=''>Transactions</p>
          </div>
          <div className='w-full'>
            <table className="table-auto w-full">
              <thead>
                <tr className='!text-left border-b border-[#1E1E1E80]'>
                  <th className='py-3 font-normal'>S/N</th>
                  <th className='font-normal'>Amount</th>
                  <th className='font-normal'>Type</th>
                  <th className='font-normal'>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => <tr key={index}>
                  <td>{index + 1}</td>
                  <td>₦{transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.date.substr(0, 10)}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {
          openAccountDetails && <div>
            <div onClick={() => setOpenAccountDetails(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
            <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[68%]  mx-auto z-20 bg-[#F8F7F4]'>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
                <p className='font-medium'>Add Account Details</p>
                <img onClick={() => setOpenAccountDetails(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
              </div>
              <div className='lg:p-10 p-4'>
                <div className='my-3'>
                  <div className='my-2'>
                    <label htmlFor="accountNumber" className='mb-2'>Account Number</label> <br />
                    <input onChange={e => setAccountNumber(e.target.value)} className='p-3 rounded-md w-full' type="number" name="accountNumber" id="accountNumber" />
                  </div>
                  <div className='my-2'>
                    <label htmlFor="bank" className='mb-2'>Bank</label> <br />
                    <select onChange={e => { verifyAccount(e.target.value) }} name="bank" id="bank" className='p-3 rounded-md w-full'>
                      <option className='hidden' value="">Select your bank</option>
                      {banks.map((bank) => <option key={index} value={bank.code}>{bank.name}</option>)}
                    </select>
                    {/* <button className='p-2 mt-2 w-18 !ml-auto bg-primary rounded-md text-white' onClick={() => verifyAccount()}>Verify</button> */}
                  </div>
                  <div className='my-2'>
                    <label htmlFor="accountName" className='mb-2'>Account Name</label> <br />
                    <input defaultValue={accountName} disabled className='p-3 rounded-md w-full' type="text" name="accountName" id="accountName" />
                    <p className='text-xs'>{loading ? 'confirming account information' : null}    </p>
                  </div>
                </div>
                <div>
                  <div className='flex'>
                    <button onClick={() => createRecipient()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {load ? <Spin /> : "Add Account"}</button>
                    <button onClick={() => setOpenAccountDetails(false)} className='mx-4'>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          openWithdraw && <div>
            <div onClick={() => setOpenWithdraw(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
            <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[45%]  mx-auto z-20 bg-[#F8F7F4]'>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
                <p className='font-medium'>Withdraw</p>
                <img onClick={() => setOpenWithdraw(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
              </div>
              <div className='lg:p-10 p-4'>
                <div className='my-3'>
                  <div className='my-2'>
                    <label htmlFor="amount" className='mb-2'>Amount</label> <br />
                    <input onChange={e => setAmount(parseInt(e.target.value))} className='p-3 rounded-md w-full' type="number" name="amount" id="amount" />
                  </div>
                </div>
                <div>
                  <div className='flex'>
                    <button onClick={() => withdraw()} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {load ? <Spin /> : "Withdraw"}</button>
                    <button onClick={() => setOpenWithdraw(false)} className='mx-4'>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }

        {
          fund && <div>
            <div onClick={() => openFund(false)} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
            <div className='fixed top-10 bottom-10 left-0 rounded-md right-0 lg:w-[50%] w-[90%] h-[45%]  mx-auto z-20 bg-[#F8F7F4]'>
              <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
                <p className='font-medium'>Fund Wallet</p>
                <img onClick={() => openFund(false)} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
              </div>
              <div className='lg:p-10 p-4'>
                <div className='my-3'>
                  <div className='my-2'>
                    <label htmlFor="amount" className='mb-2'>Amount</label> <br />
                    <input onChange={e => setAmount(parseInt(e.target.value))} className='p-3 rounded-md w-full' type="number" name="amount" id="amount" />
                  </div>
                </div>
                <div>
                  <div className='flex'>
                    <button onClick={() => handleFlutterPayment({
                      callback: (response) => {
                        addFunds()
                        openFund(false)
                        console.log(response);
                        closePaymentModal() // this will close the modal programmatically
                      },
                      onClose: () => {
                        console.log("closed")
                      },
                    })} className='p-2 bg-primary font-medium w-40 rounded-md text-sm'> {load ? <Spin /> : "Fund Wallet"}</button>

                    <button onClick={() => openFund(false)} className='mx-4'>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </DashboardLayout>
  );
};

export default Wallet;