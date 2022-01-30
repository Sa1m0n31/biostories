import React, {useEffect, useState} from 'react';
import arrowBack from "../static/assets/arrow-back.svg";
import Cart from "../components/Cart";
import {openCart} from "../helpers/others";
import {getAllShippingMethods} from "../admin/helpers/shippingFunctions";
import checkIcon from "../static/assets/check-icon.svg";
import Modal from "react-modal";
import closeImg from '../static/img/close.png'
import GeolocationWidget from "../components/GeolocationWidget";
import locationIcon from '../static/assets/location-icon.svg'
import {getAllCoupons} from "../admin/helpers/couponFunctions";
import tickIcon from '../static/img/tick-sign.svg'
import auth from "../admin/helpers/auth";
import {getUserData} from "../helpers/userFunctions";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import settings from "../helpers/settings";

const ShippingAndPayment = () => {
    const [shippingMethods, setShippingMethods] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [shippingIndex, setShippingIndex] = useState(null);
    const [shipping, setShipping] = useState(null);
    const [payment, setPayment] = useState(null);
    const [code, setCode] = useState('');
    const [codes, setCodes] = useState([]);
    const [toPay, setToPay] = useState(0);
    const [inPostAddress, setInPostAddress] = useState("");
    const [inPostCode, setInPostCode] = useState("");
    const [inPostCity, setInPostCity] = useState("");
    const [inPostModal, setInPostModal] = useState(false);
    const [codeUpdated, setCodeUpdated] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [fullDiscount, setFullDiscount] = useState(0);

    useEffect(() => {
        if(window.innerWidth > 768) openCart();
        document.querySelector('.cart .cart__header').textContent = 'Podsumowanie';
    }, []);

    useEffect(() => {
        getAllShippingMethods()
            .then((res) => {
                setShippingMethods(res?.data?.shippingMethods);
            });

        getAllCoupons()
            .then((res) => {
                setCodes(res?.data?.result);
            });

        document.addEventListener("click", () => {
            setInPostAddress(sessionStorage.getItem('paczkomat-adres'));
            setInPostCode(sessionStorage.getItem('paczkomat-kod'));
            setInPostCity(sessionStorage.getItem('paczkomat-miasto'));
        });
    }, []);

    useEffect(() => {
        window.easyPackAsyncInit = function () {
            window.easyPack.init({
                mapType: 'google',
                searchType: 'osm',
                map: {
                    googleKey: 'AIzaSyAS0nA7DChYpHzv5CVpXM1K4vqYaGNCElw'
                }
            });
            if(document.querySelector(".cart")) {
                const map = window.easyPack.mapWidget('paczkomatyMapa', function(point) {
                    /* Paczkomat zostal wybrany */
                    sessionStorage.setItem('paczkomat-id', point.name);
                    sessionStorage.setItem('paczkomat-miasto', point.address_details.city);
                    sessionStorage.setItem('paczkomat-kod', point.address_details.post_code);
                    sessionStorage.setItem('paczkomat-adres', point.address_details.street + " " + point.address_details.building_number);

                    const storage = new Event('storage');
                    document.dispatchEvent(storage);

                    const modal = document.querySelector(".bigModal");
                    if(modal) {
                        modal.style.opacity = "0";
                        setTimeout(() => {
                            modal.style.display = "none";
                        }, 500);
                    }
                });
            }
        };
    }, [inPostModal]);

    useEffect(() => {
        if(shippingIndex === 0) {
            /* Paczkomaty */
            document.querySelector(".bigModal").style.display = "block";
            document.querySelector(".bigModal").style.opacity = "1";
            document.querySelector("#easypack-search")?.setAttribute('autocomplete', 'off');
            setInPostModal(true);
        }
    }, [shipping]);

    const addOrder = () => {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const email = localStorage.getItem('email');
        const phoneNumber = localStorage.getItem('phoneNumber');
        const postalCode = localStorage.getItem('postalCode');
        const city = localStorage.getItem('city');
        const street = localStorage.getItem('street');
        const building = localStorage.getItem('building');
        const flat = localStorage.getItem('flat');

        getUserData()
            .then((res) => {
                const result = res?.data?.result;
                let sessionId = uuidv4();
                let formData;
                if(result) {
                    formData = {
                        paymentMethod: payment+1,
                        shippingMethod: shipping,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        city: city,
                        street: street,
                        building: building,
                        flat: flat,
                        postalCode: postalCode,
                        user: result.id,
                        sessionId: sessionId,
                        amount: toPay,
                        inPostName: sessionStorage.getItem('paczkomat-id'),
                        inPostAddress: sessionStorage.getItem('paczkomat-adres'),
                        inPostCode: sessionStorage.getItem('paczkomat-kod'),
                        inPostCity: sessionStorage.getItem('paczkomat-miasto'),
                        discount: fullDiscount
                    }
                }
                else {
                    formData = {
                        paymentMethod: payment+1,
                        shippingMethod: shipping,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phoneNumber: phoneNumber,
                        city: city,
                        street: street,
                        building: building,
                        flat: flat,
                        postalCode: postalCode,
                        sessionId: sessionId,
                        amount: toPay,
                        inPostName: sessionStorage.getItem('paczkomat-id'),
                        inPostAddress: sessionStorage.getItem('paczkomat-adres'),
                        inPostCode: sessionStorage.getItem('paczkomat-kod'),
                        inPostCity: sessionStorage.getItem('paczkomat-miasto'),
                        discount: fullDiscount
                    }
                }

                axios.post(`${settings.API_URL}/order/add`, formData)
                    .then(res => {
                        const orderId = res.data.result;

                        if(orderId) {
                            /* Add sells */
                            const cart = JSON.parse(localStorage.getItem('hideisland-cart'));
                            cart?.forEach((item, cartIndex, cartArray) => {
                                /* Add sells */
                                axios.post(`${settings.API_URL}/order/add-sell`, {
                                    orderId,
                                    productId: item.id,
                                    attributeName: item.attributeName,
                                    attributeValue: item.attributeValue,
                                    quantity: item.amount,
                                    paymentMethod: payment
                                })
                                    .then(res => {
                                        if(cartIndex === cartArray.length-1) {
                                            if(payment === 2 || payment === 1) {
                                                /* COD or standard transfer */
                                                localStorage.setItem('hideisland-ty', 'true');
                                                window.location = "/dziekujemy";

                                                /* Remove cart from local storage */
                                                localStorage.removeItem('hideisland-cart');
                                            }
                                            else {
                                                /* PAYMENT PROCESS */
                                                let paymentUri = "https://sandbox.przelewy24.pl/trnRequest/";

                                                axios.post(`${settings.API_URL}/payment/payment`, {
                                                    sessionId,
                                                    email: email,
                                                    amount: Math.round(toPay.toFixed(2) * 100)
                                                })
                                                    .then(res => {
                                                        /* Remove cart from local storage */
                                                        localStorage.removeItem('hideisland-cart');

                                                        const token = res.data.result;
                                                        window.location.href = `${paymentUri}${token}`;
                                                    });
                                            }

                                            axios.post(`${settings.API_URL}/order/send-order-info`, {
                                                orderId
                                            })
                                                .then((res) => {
                                                    console.log("order info sended");
                                                });
                                        }
                                    });
                            });
                        }
                        else {
                            window.location = "/";
                        }
                });
            });
    }

    return <div className="container container--deliveryData container--sAndP">

        <Modal
            isOpen={inPostModal}
            portalClassName="smallModal bigModal"
            onRequestClose={() => { setInPostModal(false) }}
        >

            <button className="modalClose" onClick={() => { setInPostModal(false) }}>
                <img className="modalClose__img" src={closeImg} alt="zamknij" />
            </button>

            <GeolocationWidget />
        </Modal>

        <main className="deliveryData">
            <div className="sAndP__header flex">
                <h1 className="deliveryData__header deliveryData__header--shippingAndPayment">
                    Dostawa i płatność
                </h1>
                <div className="deliveryData__bottom">
                    <a className="page--beforeCheckout__back" href="/dane-dostawy">
                        <img className="icon" src={arrowBack} alt="wroc" />
                        Wróć
                    </a>
                    <a className="page--beforeCheckout__back d-desktop" href="/">
                        <img className="icon" src={arrowBack} alt="wroc" />
                        Powrót na stronę główną
                    </a>
                </div>
            </div>
            <main className="sAndP__main">
                <h2 className="form__header">
                    Wybierz sposób dostawy
                </h2>
                {shippingMethods?.map((item, index) => {
                    return <label className="label--check label--check--delivery" key={index}>
                        <button className={shipping === item.id ? "checkBtn checkBtn--checked" : "checkBtn" }
                                onClick={() => { setShipping(item.id); setShippingIndex(index); }}>
                            <img src={checkIcon} alt="tak" />
                        </button>
                        <span className="label__deliveryBlock">
                            <div className="flex">
                                <h4 className="delivery__title">
                                    {item.name}
                                </h4>
                                <h5 className="delivery__price">
                                    {item.price} zł
                                </h5>
                            </div>
                            {index === 0 && shipping === item.id ? <address className="inPostAddress">
                                <img className="locationIcon" src={locationIcon} alt="lokalizacja" />
                                <span>
                                    {inPostAddress} <br/>
                                    {inPostCode} {inPostCity}
                                </span>
                            </address> : ""}
                            <p className="delivery__desc">
                                {item.description}
                            </p>
                        </span>
                    </label>
                })}


                <h2 className="form__header form__header--mt">
                    Wybierz metodę płatności
                </h2>
                <label className="label--check label--check--delivery">
                    <button className={payment === 0 ? "checkBtn checkBtn--checked" : "checkBtn" }
                            type="button"
                            onClick={() => { setPayment(0); }}>
                        <img src={checkIcon} alt="tak" />
                    </button>
                    <span className="label__deliveryBlock">
                        <div className="flex">
                            <h4 className="delivery__title">
                                Przelewy24
                            </h4>
                        </div>
                        <p className="delivery__desc">
                            Wybierz swój bank do dokonania przelewu internetowego.
                        </p>
                    </span>
                </label>
                <label className="label--check label--check--delivery">
                    <button className={payment === 1 ? "checkBtn checkBtn--checked" : "checkBtn" }
                            type="button"
                            onClick={() => { setPayment(1); }}>
                        <img src={checkIcon} alt="tak" />
                    </button>
                    <span className="label__deliveryBlock">
                        <div className="flex">
                            <h4 className="delivery__title">
                                Przelew tradycyjny
                            </h4>
                        </div>
                        <p className="delivery__desc">
                            Dane do przelewu:<br/>
                            32 3213 2313 0000 1111 0321 3213
                        </p>
                    </span>
                </label>
                <label className="label--check label--check--delivery">
                    <button className={payment === 2 ? "checkBtn checkBtn--checked" : "checkBtn" }
                            type="button"
                            onClick={() => { setPayment(2); }}>
                        <img src={checkIcon} alt="tak" />
                    </button>
                    <span className="label__deliveryBlock">
                        <div className="flex">
                            <h4 className="delivery__title">
                                Płatność przy odbiorze
                            </h4>
                        </div>
                    </span>
                </label>

                <h2 className="form__header form__header--mt">
                    Kod rabatowy
                </h2>
                <div className="codeForm flex">
                    {codeVerified ? <>
                        <img className="icon" src={tickIcon} alt="dodano" />
                        <h3 className="codeHeader">
                            Kod rabatowy został dodany
                        </h3>
                    </> : <>
                        <label>
                            <input className="input input--code"
                                   name="code"
                                   value={code}
                                   onChange={(e) => { setCode(e.target.value); }}
                                   placeholder="Kod rabatowy" />
                        </label>
                        <button className="btn btn--code" onClick={() => { setCodeUpdated(!codeUpdated); }}>
                            Dodaj kod rabatowy
                        </button>
                    </>}
                </div>
            </main>
        </main>
        <Cart deliveryProp={shipping || shipping === 0 ? shippingMethods[shippingIndex].price : 0}
              addOrder={addOrder}
              code={code}
              codes={codes}
              codeUpdated={codeUpdated}
              setToPay={setToPay}
              setFullDiscount={setFullDiscount}
              setCodeVerified={setCodeVerified}
        />
    </div>
};

export default ShippingAndPayment;
