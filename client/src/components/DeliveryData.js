import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {registerUser, updateUserAddress} from "../helpers/userFunctions";

const DeliveryData = ({user}) => {
    const [error, setError] = useState("");
    const [status, setStatus] = useState(0);

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
        onSubmit: ({postalCode, city, street, building, flat}) => {
           updateUserAddress(street, building, flat, postalCode, city)
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

export default DeliveryData;
