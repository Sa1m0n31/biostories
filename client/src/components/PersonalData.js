import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {registerUser} from "../helpers/userFunctions";

const PersonalData = ({user}) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(0);

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
        onSubmit: ({email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat}) => {
            registerUser(email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result === 1) {
                        setSuccess(1);
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

    return <section className="myAccount__section">
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
                <input className="input"
                       name="phoneNumber"
                       value={formik.values.phoneNumber}
                       onChange={formik.handleChange}
                       placeholder="Numer telefonu" />
            </label>
        </main>
        <button className="btn btn--cart btn--myAccount">
             Zmień dane
            <img className="icon" src={arrowIcon} alt="dalej" />
        </button>
    </section>
};

export default PersonalData;
