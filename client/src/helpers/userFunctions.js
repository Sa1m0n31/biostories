import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const logoutUser = () => {
    return axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true
    });
}

const loginUser = (username, password) => {
    return axios.post(`${API_URL}/auth/login-user`, {
        username, password
    });
}

const registerUser = (email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat) => {
    return axios.post(`${API_URL}/auth/register-user`, {
        email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat
    });
}

const verifyUser = (token) => {
    return axios.post(`${API_URL}/auth/verify-user`, {
        token
    });
}

export { logoutUser, loginUser, registerUser, verifyUser }
