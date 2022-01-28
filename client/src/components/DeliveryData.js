import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {registerUser} from "../helpers/userFunctions";

const DeliveryData = ({user}) => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(0);

    useEffect(() => {
        if(user) {
            formik.setFieldValue('postalCode', user.postal_code);
            formik.setFieldValue('city', user.city);
            formik.setFieldValue('street', user.street);
            formik.setFieldValue('building', user.building);
            formik.setFieldValue('flat', user.flat);
        }
    }, [user]);

    const validationSchema = Yup.object({
        postalCode: Yup.string()
            .matches(/\d{2}-\d{3}/, "Podaj poprawny kod pocztowy")
    });

    const formik = useFormik({
        initialValues: {
            postalCode: "",
            city: "",
            street: "",
            building: "",
            flat: ""
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
            Domyślny adres
        </h2>
        <main>
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
        </main>
        <button className="btn btn--cart btn--myAccount">
             Zmień dane
            <img className="icon" src={arrowIcon} alt="dalej" />
        </button>
    </section>
};

export default DeliveryData;
