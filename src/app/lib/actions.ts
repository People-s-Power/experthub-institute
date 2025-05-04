"use server"

import apiService from "@/utils/apiService"


export async function fetchCourses() {
    try {
        const { data } = await apiService.get("courses/all")

        return {
            success: true,
            courses: data.courses.slice(0, 12),
        }
    } catch (error) {
        console.error("Error fetching courses:", error)
        return {
            success: false,
            courses: [],
        }
    }
}
