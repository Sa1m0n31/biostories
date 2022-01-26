import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'

import "aos/dist/aos.css";
import AOS from 'aos';
import CookieConsent from "react-cookie-consent";

import './static/style/admin.css'
import './static/style/adminMobile.css'
import './static/style/style.css'
import './static/style/mobile.css'

import { BrowserRouter as Router, Route } from 'react-router-dom';

import LoginPage from "./admin/pages/LoginPage";
import PanelPage from "./admin/pages/PanelPage";
import PanelProducts from "./admin/pages/PanelProducts";
import PanelOrders from "./admin/pages/PanelOrders";
import PanelCategories from "./admin/pages/PanelCategories";
import PanelPayment from "./admin/pages/PanelPayment";
import PanelShipping from "./admin/pages/PanelShipping";
import PanelSettings from "./admin/pages/PanelSettings";
import PanelCoupons from "./admin/pages/PanelCoupons";
import PanelOthers from "./admin/pages/PanelOthers";

import AddProductPage from "./admin/pages/AddProductPage";
import AddPostPage from "./admin/pages/AddPostPage";
import OrderDetails from "./admin/pages/OrderDetails";
import {getPagesContent} from "./helpers/pagesFunctions";
import PanelImages from "./admin/pages/PanelImages";
import NewsletterPage from "./admin/pages/NewsletterPage";
import auth from "./admin/helpers/auth";
import { v4 as uuidv4 } from 'uuid';
import PanelStocks from "./admin/pages/PanelStocks";
import AddStockPage from "./admin/pages/AddStockPage";
import {getProductStock} from "./admin/helpers/stockFunctions";
import AddOrderPage from "./admin/pages/AddOrderPage";
import axios from "axios";
import credentials from "./helpers/credentials";
import Homepage from "./pages/Homepage";
import PanelAddCategory from "./admin/pages/PanelAddCategory";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TyAfterRegister from "./pages/TyAfterRegister";
import VerificationPage from "./pages/VerificationPage";
import BeforeCheckout from "./pages/BeforeCheckout";
import Shop from "./pages/Shop";
import CartPage from "./pages/CartPage";
import DeliveryDataPage from "./pages/DeliveryDataPage";
import ShippingAndPayment from "./pages/ShippingAndPayment";
require('dotenv').config();

axios.defaults.headers.common['Authorization'] = credentials.AUTH_HEADER;

/* Context */
const CartContext = React.createContext(null);

function App() {
    const [cartContent, setCartContent] = useState(localStorage.getItem('hideisland-cart') ? JSON.parse(localStorage.getItem('hideisland-cart')) : []);

    const addToCart = (id, title, amount, img, attributeName, attributeValue, price) => {
        const uuid = uuidv4();

        let existedUuid, existedAmount = 0;

        console.log(id, title, amount, img, attributeName, attributeValue, price);

        console.log(cartContent);
        /* If product already in cart - increase amount */
        if(cartContent.findIndex((item) => {
            console.log(item.id, item.attributeName, item.attributeValue);
           if((item.id === id)&&(item.attributeName === attributeName)&&(item.attributeValue === attributeValue)) {
               existedUuid = item.uuid;
               existedAmount = item.amount;
               return true;
           }
           else return false;
        }) !== -1) {
            console.log(existedUuid);
            if(existedUuid) {
                getProductStock(id)
                    .then(res => {
                        console.log(res?.data?.result);
                        const result = res?.data?.result[0].stock;
                        if(result >= existedAmount+amount) {
                            editCart(existedUuid, id, title, existedAmount+amount, img, attributeName, attributeValue, price);
                        }
                    });
            }
        }
        else {
            localStorage.setItem('hideisland-cart', JSON.stringify([...cartContent, {
                uuid, id, title, amount, img, attributeName, attributeValue, price
            }]));

            setCartContent([...cartContent, {
                uuid, id, title, amount, img, attributeName, attributeValue, price
            }]);
        }
    }

    const editCart = (uuid, id, title, amount, img, attributeName, attributeValue, price) => {
        localStorage.setItem('hideisland-cart', JSON.stringify(cartContent.map((item) => {
            if(item.uuid === uuid) {
                return {
                    uuid, id, title, amount, img, attributeName, attributeValue, price
                }
            }
            else return item;
        })));

        setCartContent(cartContent.map((item) => {
            if(item.uuid === uuid) {
                return {
                    uuid, id, title, amount, img, attributeName, attributeValue, price
                }
            }
            else return item;
        }));
    }

    const removeFromCart = (uuid) => {
        const localStorageItem = localStorage.getItem('hideisland-cart');
        if(localStorageItem) {
            const newCart = JSON.parse(localStorage.getItem('hideisland-cart'))
                .filter((item) => {
                   return item.uuid !== uuid;
                });
            setCartContent(newCart);
            localStorage.setItem('hideisland-cart', JSON.stringify(newCart));
        }
    }

    const [terms, setTerms] = useState("");
    const [policy, setPolicy] = useState("");
    const [complaints, setComplaints] = useState("");
    const [returns, setReturns] = useState("");
    const [shippingAndPayment, setShippingAndPayment] = useState("");

    useEffect(() => {
        /* Initialize AOS */
        AOS.init({
            offset: -50,
            mirror: true
        });

        /* Get pages content */
        getPagesContent()
            .then(res => {
                const result = res.data?.result;
                if(result?.length) {
                    setTerms(result[0].terms_of_service);
                    setPolicy(result[0].privacy_policy);
                    setComplaints(result[0].complaints);
                    setReturns(result[0].returns);
                    setShippingAndPayment(result[0].shipping_and_payment);
                }
            });

        /* Auth */
        auth(localStorage.getItem('sec-sessionKey'))
            .then(res => {
               if(!res.data.result) {
                   localStorage.removeItem('sec-user-id');
               }
            });
    }, []);

  return (<CartContext.Provider value={{cartContent, addToCart, editCart, removeFromCart}}>
      <Helmet>
          <title>HideIsland - ubrania dla Ciebie</title>
          <link rel="icon" type="image/png" href="./static/img/favicon.ico" sizes="16x16" />
      </Helmet>
      <div className="App">
        <Router>
          {/* Website routes */}
          <Route exact path="/">
              <Homepage />
          </Route>
            <Route path="/logowanie">
                <Login />
            </Route>
            <Route path="/rejestracja">
                <Register />
            </Route>
            <Route path="/po-rejestracji">
                <TyAfterRegister />
            </Route>
            <Route path="/weryfikacja">
                <VerificationPage />
            </Route>
            <Route path="/zakupy">
                <BeforeCheckout />
            </Route>
            <Route path="/sklep">
                <Shop />
            </Route>
            <Route path="/koszyk">
                <CartPage />
            </Route>
            <Route path="/dane-dostawy">
                <DeliveryDataPage />
            </Route>
            <Route path="/dostawa-i-platnosc">
                <ShippingAndPayment />
            </Route>

            {/* Admin routes */}
            <Route exact path='/admin'>
                <LoginPage />
            </Route>
            <Route exact path="/panel">
                <PanelPage />
            </Route>
            <Route path="/panel/produkty">
                <PanelProducts />
            </Route>
            <Route path="/panel/zamowienia">
                <PanelOrders />
            </Route>
            <Route path="/panel/kategorie">
                <PanelCategories />
            </Route>
            <Route path="/panel/dodaj-kategorie">
                <PanelAddCategory />
            </Route>
            <Route path="/panel/platnosci">
                <PanelPayment />
            </Route>
            <Route path="/panel/wysylka">
                <PanelShipping />
            </Route>
            <Route path="/panel/ustawienia">
                <PanelSettings />
            </Route>
            <Route path="/panel/kupony">
                <PanelCoupons />
            </Route>
            <Route path="/panel/zdjecia">
                <PanelImages />
            </Route>
            <Route path="/panel/pozostale">
                <PanelOthers />
            </Route>
            <Route path="/panel/newsletter">
                <NewsletterPage />
            </Route>
            <Route path="/panel/stany-magazynowe">
                <PanelStocks />
            </Route>
            <Route path="/panel/dodaj-stan-magazynowy">
                <AddStockPage />
            </Route>
            <Route path="/panel/dodaj-zamowienie">
                <AddOrderPage />
            </Route>

            {/* Add content pages */}
            <Route path="/panel/dodaj-produkt">
                <AddProductPage />
            </Route>
            <Route path="/panel/dodaj-wpis">
                <AddPostPage />
            </Route>

            {/* Order details */}
            <Route path="/panel/szczegoly-zamowienia">
                <OrderDetails />
            </Route>
        </Router>

          <CookieConsent buttonText="OK">
              Ta strona korzysta z plików cookies w celu usprawnienia i promocji naszych usług. Pozostanie na niej jest równoznaczne z zaakceptowaniem naszej <a className="cookiesLink" href="/polityka-prywatnosci">Polityki Prywatności</a>.
          </CookieConsent>
    </div>
  </CartContext.Provider>);
}

export default App;
export { CartContext }
