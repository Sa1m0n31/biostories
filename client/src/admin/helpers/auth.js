import axios from "axios";
import settings from "./settings";

const auth = () => {
    return axios.get(`${settings.API_URL}/auth/auth`, {
        withCredentials: true
    });
}

export default auth;
