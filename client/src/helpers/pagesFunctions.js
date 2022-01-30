import axios from "axios";
import settings from "./settings";
import {convertToRaw} from "draft-js";

const { API_URL } = settings;

const getPagesContent = () => {
   return axios.get(`${API_URL}/pages/content`);
}

const updatePages = (termsOfService, privacyPolicy, returns, shippingAndPayment) => {
   termsOfService = termsOfService ? JSON.stringify(convertToRaw(termsOfService?.getCurrentContent())) : '';
   privacyPolicy = privacyPolicy ? JSON.stringify(convertToRaw(privacyPolicy?.getCurrentContent())) : '';
   returns = returns ? JSON.stringify(convertToRaw(returns?.getCurrentContent())) : '';
   shippingAndPayment = shippingAndPayment ? JSON.stringify(convertToRaw(shippingAndPayment?.getCurrentContent())) : '';
   return axios.post(`${API_URL}/pages/update`, {
      termsOfService, privacyPolicy, returns, shippingAndPayment,
   });
}

export  { getPagesContent, updatePages }
