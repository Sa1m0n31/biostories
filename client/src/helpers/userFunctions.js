import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const logoutUser = () => {
    return axios.get(`${API_URL}/auth/logout`, {
        withCredentials: true
    })
        .then((res) => {
            window.location = '/';
        });
}

const loginUser = (username, password) => {
    return axios.post(`${API_URL}/auth/login-user`, {
        username, password
    }, {
        withCredentials: true
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

const getUserData = () => {
    return axios.get(`${API_URL}/user/get-user-data`, {
        withCredentials: true
    });
}

const getUserOrders = (email) => {
    return axios.post(`${API_URL}/user/get-user-orders`, {
        user: email
    });
}

const changeUserPassword = (email, oldPassword, newPassword) => {
    return axios.post(`${API_URL}/user/change-user-password`, {
        email, oldPassword, newPassword
    });
}

const updateUserData = (firstName, lastName, phoneNumber) => {
    return axios.post(`${API_URL}/user/update-user-data`, {
        firstName, lastName, phoneNumber
    }, {
        withCredentials: true
    });
}

const updateUserAddress = (street, building, flat, postalCode, city) => {
    return axios.post(`${API_URL}/user/update-user-address`, {
        street, building, flat, postalCode, city
    }, {
        withCredentials: true
    });
}

export { logoutUser, loginUser, registerUser, verifyUser, getUserData, getUserOrders, changeUserPassword, updateUserData, updateUserAddress }
