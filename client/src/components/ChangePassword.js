import React, {useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {registerUser} from "../helpers/userFunctions";

const ChangePassword = () => {
    const [error, setError] = useState("");
    const [status, setStatus] = useState(0);

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(6, "Hasło musi składać się z co najmniej sześciu znaków")
            .required("Wpisz hasło"),
        repeatPassword: Yup.string()
            .oneOf([Yup.ref('password')], "Podane hasła nie są identyczne")
            .required("Powtórz hasło")
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            password: "",
            repeatPassword: ""
        },
        validationSchema,
        onSubmit: ({email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat}) => {
            registerUser(email, password, firstName, lastName, phoneNumber, postalCode, city, street, building, flat)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result === 1) {
                        setStatus(1);
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
            Zmień hasło
        </h2>
        <main>
            <label>
                <input className={formik.errors.oldPassword && formik.touched    ? "input input--error" : "input"}
                       name="oldPassword"
                       type="password"
                       value={formik.values.oldPassword}
                       onChange={formik.handleChange}
                       placeholder="Stare hasło" />
            </label>
            <label>
                <input className={formik.errors.password && formik.touched ? "input input--error" : "input"}
                       name="password"
                       type="password"
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       placeholder="Nowe hasło" />
            </label>
            <label>
                <input className={formik.errors.repeatPassword && formik.touched ? "input input--error" : "input"}
                       name="repeatPassword"
                       type="password"
                       value={formik.values.repeatPassword}
                       onChange={formik.handleChange}
                       placeholder="Powtórz nowe hasło" />
            </label>
        </main>
        <button className="btn btn--cart btn--myAccount">
            Zmień hasło
            <img className="icon" src={arrowIcon} alt="dalej" />
        </button>
    </section>
};

export default ChangePassword;
