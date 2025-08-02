import { trainingsBaseURL } from "@/lib/utils";
import axios from "axios";


const apiService = axios.create({
    baseURL: trainingsBaseURL + "/",
})

export default apiService;
