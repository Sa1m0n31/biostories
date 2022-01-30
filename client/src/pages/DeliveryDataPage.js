import React, {useEffect, useState} from 'react';
import Cart from "../components/Cart";
import {openCart} from "../helpers/others";
import checkIcon from "../static/assets/check-icon.svg";
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {getUserData, registerUser} from "../helpers/userFunctions";
import arrowBack from "../static/assets/arrow-back.svg";

const DeliveryDataPage = () => {
    useEffect(() => {
        if(window.innerWidth > 768) openCart();

        getUserData()
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    formik.setFieldValue('firstName', result.first_name);
                    formik.setFieldValue('lastName', result.last_name);
                    formik.setFieldValue('email', result.email);
                    formik.setFieldValue('phoneNumber', result.phone_number);
                    formik.setFieldValue('postalCode', result.postal_code);
                    formik.setFieldValue('city', result.city);
                    formik.setFieldValue('street', result.street);
                    formik.setFieldValue('building', result.building);
                    formik.setFieldValue('flat', result.flat);
                }
            })
    }, []);

    const [error, setError] = useState("");

    const validationSchema = Yup.object({
        firstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required(),
        email: Yup.string()
            .email("Podaj poprawny adres email")
            .required("Wpisz swój adres email"),
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry')
            .required(),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy")
            .required(),
        city: Yup.string()
            .required(),
        street: Yup.string()
            .required(),
        building: Yup.string()
            .required()
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            postalCode: "",
            city: "",
            street: "",
            building: "",
            flat: ""
        },
        validationSchema,
        onSubmit: ({email, firstName, lastName, phoneNumber, postalCode, city, street, building, flat}) => {
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('email', email);
            localStorage.setItem('phoneNumber', phoneNumber);
            localStorage.setItem('postalCode', postalCode);
            localStorage.setItem('city', city);
            localStorage.setItem('street', street);
            localStorage.setItem('building', building);
            localStorage.setItem('flat', flat);
            window.location = '/dostawa-i-platnosc'
        }
    })

    return <div className="container container--deliveryData">
        <main className="deliveryData">
            <h1 className="deliveryData__header">
                Wprowadź swoje dane
            </h1>
            <form className="form form--deliveryData"
                  onSubmit={formik.handleSubmit}
            >
                <h2 className="form__header">
                    Dane osobowe
                </h2>
                <div className="form__row">
                    <label className="label--name">
                        <input className={formik.errors.firstName && formik.touched ? "input input--error" : "input"}
                               name="firstName"
                               value={formik.values.firstName}
                               onChange={formik.handleChange}
                               placeholder="Imię" />
                    </label>
                    <label className="label--surname">
                        <input className={formik.errors.lastName && formik.touched ? "input input--error" : "input"}
                               name="lastName"
                               value={formik.values.lastName}
                               onChange={formik.handleChange}
                               placeholder="Nazwisko" />
                    </label>
                </div>
                <label>
                    <input className={formik.errors.phoneNumber && formik.touched ? "input input--error" : "input"}
                           name="phoneNumber"
                           value={formik.values.phoneNumber}
                           onChange={formik.handleChange}
                           placeholder="Numer telefonu" />
                </label>
                <label>
                    <input className={formik.errors.email && formik.touched ? "input input--error" : "input"}
                           name="email"
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           placeholder="Adres e-mail" />
                </label>

                <h2 className="form__header form__header--2">
                    Dane adresowe
                </h2>
                <div className="form__row">
                    <label className="label--postalCode">
                        <input className={formik.errors.postalCode && formik.touched ? "input input--error" : "input"}
                               name="postalCode"
                               value={formik.values.postalCode}
                               onChange={formik.handleChange}
                               placeholder="Kod pocztowy" />
                    </label>
                    <label className="label--city">
                        <input className={formik.errors.city && formik.touched ? "input input--error" : "input"}
                               name="city"
                               value={formik.values.city}
                               onChange={formik.handleChange}
                               placeholder="Miejscowość" />
                    </label>
                </div>
                <div className="form__row">
                    <label className="label--street">
                        <input className={formik.errors.street && formik.touched ? "input input--error" : "input"}
                               name="street"
                               value={formik.values.street}
                               onChange={formik.handleChange}
                               placeholder="Ulica" />
                    </label>
                    <label className="label--building">
                        <input className={formik.errors.building && formik.touched ? "input input--error" : "input"}
                               name="building"
                               value={formik.values.building}
                               onChange={formik.handleChange}
                               placeholder="Nr budynku" />
                    </label>
                    <label className="label--flat">
                        <input className={formik.errors.flat && formik.touched ? "input input--error" : "input"}
                               name="flat"
                               value={formik.values.flat}
                               onChange={formik.handleChange}
                               placeholder="Nr mieszkania" />
                    </label>
                </div>
                <button className="btn btn--submit"
                        type="submit">
                    Dostawa i płatność
                    <img className="icon" src={arrowIcon} alt="dalej" />
                </button>
                {error ? <h4 className="error">
                    {error}
                </h4> : ""}
            </form>
        </main>
        <div className="deliveryData__bottom">
            <a className="page--beforeCheckout__back" href="/koszyk">
                <img className="icon" src={arrowBack} alt="wroc" />
                Wróć
            </a>
            <a className="page--beforeCheckout__back" href="/">
                <img className="icon" src={arrowBack} alt="wroc" />
                Powrót na stronę główną
            </a>
        </div>
        <Cart />
    </div>
};

export default DeliveryDataPage;
