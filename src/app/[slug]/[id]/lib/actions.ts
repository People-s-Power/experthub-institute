"use server"

import { CourseTypeSingle, EventTypeSingle } from "@/types/CourseType"
import apiService from "@/utils/apiService"

export async function getCourse(id: string): Promise<CourseTypeSingle | null> {
    try {
        const response = await apiService.get(`courses/single-course/${id}`)
        return response.data.course
    } catch (e) {
        console.log(e)
        return null
    }

}
export async function getEvent(id: string): Promise<EventTypeSingle | null> {
    try {
        const response = await apiService.get(`events/${id}`)

        return response.data.course
    } catch (e) {
        console.log(e)
        return null
    }

}
export async function getRelatedCourses(id: string): Promise<CourseTypeSingle[] | null> {

    try {
        const response = await apiService.get(`courses/related/${id}`)
        return response.data
    } catch (e) {
        console.log(e)
        return null
    }

}
