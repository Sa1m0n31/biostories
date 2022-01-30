import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import * as Yup from "yup";
import {useFormik} from "formik";
import {changeUserPassword, registerUser} from "../helpers/userFunctions";

const ChangePassword = ({user}) => {
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
        onSubmit: ({oldPassword, password}) => {
            changeUserPassword(user.email, oldPassword, password)
                .then((res) => {
                    const result = res?.data?.result;
                    if(result === 1) {
                        setStatus(1);
                        formik.setFieldValue('oldPassword', '');
                        formik.setFieldValue('password', '');
                        formik.setFieldValue('repeatPassword', '');
                    }
                    else if(result === -1) {
                        setError('Coś poszło nie tak... Prosimy spróbować później');
                    }
                    else {
                        setError('Niepoprawne hasło');
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
        {status || error ? (status ? <h4 className="response">
                Hasło zostało zmienione
            </h4> :
            <h4 className="error">
                {error}
            </h4>) :
            <button className="btn btn--cart btn--myAccount" type="submit">
                Zmień hasło
                <img className="icon" src={arrowIcon} alt="dalej" />
            </button>}
    </form>
};

export default ChangePassword;
