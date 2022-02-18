import axios from "axios";
import settings from "./settings";
import {convertToRaw} from "draft-js";

const { API_URL } = settings;

const getAllAdmins = () => {
    return axios.get(`${API_URL}/user/get-all-admins`);
}

const addAdmin = ({username, email, password1}) => {
    return axios.post(`${API_URL}/auth/register-admin`, {
       username,
       email,
       password: password1
    });
}

const deleteAdmin = (id) => {
    return axios.post(`${API_URL}/user/delete-admin`, {
        id
    });
}

const changePassword = ({username, oldPassword, newPassword}) => {
    return axios.post(`${API_URL}/user/change-admin-password`, {
        username,
        oldPassword,
        newPassword
    });
}

const getCustomFields = () => {
    return axios.get(`${API_URL}/user/get-custom-fields`);
}

const updateCustomFields = (img1, img2, img3, img4, img5, img6, img7, img8, article1, article2, article3,
                            link1, link2, link3, link4, link5, mediaType1, mediaType2, mediaType3, mediaType4, mediaType5, mediaType6, mediaType7, mediaType8,
                            ) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const formData = new FormData();
    formData.append('img1', img1?.file);
    formData.append('img2', img2?.file);
    formData.append('img3', img3?.file);
    formData.append('img4', img4?.file);
    formData.append('img5', img5?.file);
    formData.append('img6', img6?.file);
    formData.append('img7', img7?.file);
    formData.append('img8', img8?.file);
    formData.append('link1', link1);
    formData.append('link2', link2);
    formData.append('link3', link3);
    formData.append('link4', link4);
    formData.append('link5', link5);
    formData.append('mediaType1', mediaType1);
    formData.append('mediaType2', mediaType2);
    formData.append('mediaType3', mediaType3);
    formData.append('mediaType4', mediaType4);
    formData.append('mediaType5', mediaType5);
    formData.append('mediaType6', mediaType6);
    formData.append('mediaType7', mediaType7);
    formData.append('mediaType8', mediaType8);
    formData.append('article1', article1 ? JSON.stringify(convertToRaw(article1?.getCurrentContent())) : '');
    formData.append('article2', article2 ? JSON.stringify(convertToRaw(article2?.getCurrentContent())) : '');
    formData.append('article3', article3 ? JSON.stringify(convertToRaw(article3?.getCurrentContent())) : '');
    return axios.post(`${API_URL}/user/update-custom-fields`, formData, config);
}

export { getAllAdmins, addAdmin, deleteAdmin, changePassword, getCustomFields, updateCustomFields };
