"use client"

import { useEffect, useState } from "react"
import { useAppSelector } from "@/store/hooks"
import apiService from "@/utils/apiService"

const ChatWidget = () => {
  const user = useAppSelector((state) => state.value)
  const [userProfile, setUserProfile] = useState(null)
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false)

  const key = "nj4Rk7eeLMDVGMuRWokrcLxE"

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await apiService.get(`user/profile/${user.id}`)
        setUserProfile(response.data.user)
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }

    if (user && !userProfile) {
      getUser()
    }
  }, [user, userProfile])

  useEffect(() => {
    if (user && userProfile && !isWidgetLoaded) {
      const loadChatWidget = () => {
        const identifierHash = generateHash(user.id)

        window.chatwootSettings = {
          hideMessageBubble: false,
          position: "right",
          locale: "en",
          type: "standard",
        }

        const script = document.createElement("script")
        script.src = "https://chatcloud.b-cdn.net/packs/js/sdk.js"
        script.defer = true
        script.async = true
        script.onload = () => {
          window.chatcloudSDK.run({
            websiteToken: "kRoSLfZRdV4gank5Pn7ZQwrK",
            baseUrl: "https://app1.chatcloud.ai",
          })
          window.$chatcloud.setUser(user.id, {
            name: user.fullName,
            email: user.email,
            identifier_hash: identifierHash,
          })
        }
        document.body.appendChild(script)
        setIsWidgetLoaded(true)
      }

      loadChatWidget()
    }
  }, [user, userProfile, isWidgetLoaded])

  // This function simulates the HMAC generation on the client-side
  // In a production environment, this should be done server-side
  const generateHash = (userId) => {
    // This is a placeholder function and should be replaced with a server-side implementation
    return `simulated-hash-for-${userId}`
  }

  return null
}

export default ChatWidget

