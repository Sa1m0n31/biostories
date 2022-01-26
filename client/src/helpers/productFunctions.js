import axios from "axios";
import settings from "./settings";
import { convertToRaw } from 'draft-js';
const { API_URL } = settings;

const addProduct = (formData, title, subtitle, price, stock, attribute, attributeValues,
                    description, secondDescription, thirdDescription, fourthDescription,
                    img, img2, img3, img4, img5,
                    categories, recommendation, top, hidden) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('attribute', attribute);
    formData.append('attributeValues', attributeValues);
    formData.append('recommendation', recommendation);
    formData.append('top', top);
    formData.append('hidden', hidden);
    formData.append('categories', JSON.stringify(categories));
    formData.append('img', img?.file);
    formData.append('img2', img2?.file);
    formData.append('img3', img3?.file);
    formData.append('img4', img4?.file);
    formData.append('img5', img5?.file);
    formData.append('description', description ? JSON.stringify(convertToRaw(description?.getCurrentContent())) : '');
    formData.append('secondDescription', secondDescription ? JSON.stringify(convertToRaw(secondDescription?.getCurrentContent())) : '');
    formData.append('thirdDescription', thirdDescription ? JSON.stringify(convertToRaw(thirdDescription?.getCurrentContent())) : '');
    formData.append('fourthDescription', fourthDescription ? JSON.stringify(convertToRaw(fourthDescription?.getCurrentContent())) : '');

    return axios.post(`${API_URL}/product/add-product`, formData, config);
}

const getAllProducts = () => {
    return axios.get(`${API_URL}/product/get-all-products`);
}

const getSingleProduct = (id) => {
    return axios.post(`${API_URL}/product/single-product`, { id });
}

const getProductById = (id) => {
    return axios.post(`${API_URL}/product/get-product-by-id`, { id });
}

const getProductByName = (name) => {
    return axios.post(`${API_URL}/product/get-product-by-name`, { name });
}

const getProductsByCategory = (id) => {
    return axios.post(`${API_URL}/product/get-products-by-category`, { id });
}

const getProductByCategories = (categoriesIds) => {
    return axios.post(`${API_URL}/product/get-products-by-categories`, { ids: categoriesIds });
}

const getImageById = (id) => {
    return axios.post(`${API_URL}/product/get-image`, { id });
}

export { getAllProducts, getSingleProduct, getProductByName, getProductsByCategory, getImageById, getProductById, addProduct };
