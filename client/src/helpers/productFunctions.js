import axios from "axios";
import settings from "./settings";

const { API_URL } = settings;

const addProduct = (title, subtitle, price, stock, attribute, attributeValues,
                    description, secondDescription, thirdDescription, fourthDescription,
                    img, img2, img3, img4, img5,
                    gallery, icons, categories) => {
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    let formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('price', price);
    formData.append('stock', stock);
    formData.append('attribute', attribute);
    formData.append('attributeValues', attributeValues);
    formData.append('categories', categories);
    formData.append('img', img?.file);
    formData.append('img2', img2?.file);
    formData.append('img3', img3);
    formData.append('img4', img4);
    formData.append('img5', img5);
    formData.append('title', title);
    formData.append('secondDescription', secondDescription);
    formData.append('thirdDescription', thirdDescription);
    formData.append('fourthDescription', fourthDescription);
    // formData.append('gallery', );
    formData.append('icons', icons);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', gallery[0].source, true);
    xhr.responseType = 'blob';
    // JEST OK!
    xhr.onload = function(e) {
        if (this.status == 200) {
            var myBlob = this.response;
            console.log(myBlob);
            formData.append('gallery', new File([myBlob], 'name'));

            return axios.post(`${API_URL}/product/add-product`, formData, config);
        }
    };
    xhr.send();
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
