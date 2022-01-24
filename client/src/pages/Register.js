import React, {useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import { useFormik } from "formik";
import * as Yup from 'yup'
import arrowIcon from '../static/assets/arrow-right.svg'
import checkIcon from '../static/assets/check-icon.svg'
import {registerUser} from "../helpers/userFunctions";

const Register = () => {
    const [error, setError] = useState("");

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Podaj poprawny adres email")
            .required("Wpisz swój adres email"),
        password: Yup.string()
            .min(6, "Hasło musi składać się z co najmniej sześciu znaków")
            .required("Wpisz hasło"),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Podane hasła nie są identyczne")
            .required("Powtórz hasło"),
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry'),
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy"),
        check: Yup.boolean()
            .oneOf([true]),
        marketing: Yup.boolean()
            .oneOf([true, false])
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            repeatPassword: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            postalCode: "",
            city: "",
            street: "",
            building: "",
            flat: "",
            check: false
        },
        validationSchema,
        onSubmit: ({email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat}) => {
            registerUser(email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result === 1) {
                        window.location = '/po-rejestracji';
                    }
                    else if(result === -1) {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    else {
                        setError('Konto o podanym adresie e-mail już istnieje');
                    }
                });
        }
    })

    return <div className="container">
        <Header />
        <TopMenu />
        <main className="page page--register">
            <h1 className="page__header">
                Rejestracja
            </h1>
            <form className="form"
                  onSubmit={formik.handleSubmit}
            >
                <h2 className="form__header">
                    Konto
                </h2>
                <label>
                    <input className={formik.errors.email && formik.touched ? "input input--error" : "input"}
                           name="email"
                           value={formik.values.email}
                           onChange={formik.handleChange}
                           placeholder="Adres e-mail" />
                </label>
                <label>
                    <input className={formik.errors.password && formik.touched ? "input input--error" : "input"}
                           name="password"
                           type="password"
                           value={formik.values.password}
                           onChange={formik.handleChange}
                           placeholder="Hasło" />
                </label>
                <label>
                    <input className={formik.errors.repeatPassword && formik.touched ? "input input--error" : "input"}
                           name="repeatPassword"
                           type="password"
                           value={formik.values.repeatPassword}
                           onChange={formik.handleChange}
                           placeholder="Powtórz hasło" />
                </label>

                <h2 className="form__header form__header--2">
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
                <label className="label--check">
                    <button className={formik.values.check ? "checkBtn checkBtn--checked" : "checkBtn" }
                            type="button"
                            onClick={() => { formik.setFieldValue('check', !formik.values.check) }}>
                            <img src={checkIcon} alt="tak" />
                    </button>
                    Zapoznałem się i akceptuję Regulamin i Politykę prywatności
                </label>
                <button className="btn btn--submit"
                        onClick={() => { window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        }); }}
                        type="submit">
                    Załóż konto
                    <img className="icon" src={arrowIcon} alt="dalej" />
                </button>
                {error ? <h4 className="error">
                    {error}
                </h4> : ""}
            </form>
        </main>
        <Footer />
    </div>
};

export default Register;
