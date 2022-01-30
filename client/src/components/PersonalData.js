import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {registerUser, updateUserData} from "../helpers/userFunctions";

const PersonalData = ({user}) => {
    const [error, setError] = useState("");
    const [status, setStatus] = useState(0);

    useEffect(() => {
        if(user) {
            formik.setFieldValue('firstName', user.first_name);
            formik.setFieldValue('lastName', user.last_name);
            formik.setFieldValue('phoneNumber', user.phone_number);
        }
    }, [user]);

    const validationSchema = Yup.object({
        phoneNumber: Yup.string()
            .matches(/\d{3,}/, 'Numer telefonu może zawierać wyłącznie cyfry'),
        firstName: Yup.string()
            .required(),
        lastName: Yup.string()
            .required()
    });

    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            phoneNumber: ""
        },
        validationSchema,
        onSubmit: ({firstName, lastName, phoneNumber}) => {
            updateUserData(firstName, lastName, phoneNumber)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result === 1) {
                        setStatus(1);
                    }
                    else {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                });
        }
    });

    useEffect(() => {
        if(status !== 0) {
            setTimeout(() => {
                setStatus(0);
            }, 3000);
        }
    }, [status]);

    useEffect(() => {
        if(error) {
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }, [error]);

    return <form className="myAccount__section" onSubmit={formik.handleSubmit}>
        <h2 className="myAccount__header">
            Dane osobowe
        </h2>
        <main>
            <label>
                <input className="input"
                       name="email"
                       value={user?.email}
                       disabled={true}
                       placeholder="Adres e-mail" />
            </label>
            <div className="form__row">
                <label className="label--name">
                    <input className="input"
                           name="firstName"
                           value={formik.values.firstName}
                           onChange={formik.handleChange}
                           placeholder="Imię" />
                </label>
                <label className="label--surname">
                    <input className="input"
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
        </main>
        {status || error ? (status ? <h4 className="response">
                Dane zostały zaktualizowane
            </h4> :
            <h4 className="error">
                {error}
            </h4>) :
            <button className="btn btn--cart btn--myAccount" type="submit">
                Zmień dane
                <img className="icon" src={arrowIcon} alt="dalej" />
            </button>}
    </form>
};

export default PersonalData;
