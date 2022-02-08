import React, {useEffect, useRef, useState} from 'react';
import arrow from '../static/assets/arrow-right.svg'
import axios from "axios";
import settings from "../admin/helpers/settings";

const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const newsletterLabel = useRef(null);
    const newsletterBtn = useRef(null);
    const newsletterSuccess= useRef(null);

    const isEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = () => {
        if(isEmail(email)) {
            setError("");
            axios.post(`${settings.API_URL}/newsletter/add`, { email })
                .then(res => {
                    if(res.data.result === 1) {
                        setSuccess(true);
                        setEmail("");
                    }
                    else {
                        setError("Coś poszło nie tak... Prosimy spróbować później.");
                    }
                });
        }
        else {
            setError("Podaj poprawny adres e-mail");
        }
    }

    useEffect(() => {
        if(success) {
            newsletterLabel.current.style.opacity = '0';
            newsletterBtn.current.style.opacity = '0';
            newsletterSuccess.current.style.zIndex = '1';
            setTimeout(() => {
                newsletterSuccess.current.style.opacity = '1';
            }, 300);
        }
    }, [success]);

    useEffect(() => {
        if(error) {
            setTimeout(() => {
                setError("");
            }, 31221000);
        }
    }, [error]);

    return <section className="newsletter flex">
        <h3 className="newsletter__header">
            Zapisz się
            <span className="d-block">do Newslettera</span>
        </h3>
        <p className="newsletter__text">
            Zapisz się
            <span className="d-block">i zyskaj <b>rabat 5% na pierwsze zakupy!</b></span>
        </p>
        <section className="newsletter__form flex">
            <label ref={newsletterLabel}>
                <input className="newsletter__input"
                       name="email"
                       placeholder="Twój adres e-mail"
                       value={email}
                       onChange={(e) => { setEmail(e.target.value); }} />
                {error ? <span className="error">
                    {error}
                </span> : ""}
            </label>
           <button className="newsletter__submitBtn"
                   ref={newsletterBtn}
                   onClick={() => { handleSubmit(); }}>
               Zapisz się
               <img className="arrowIcon" src={arrow} alt="dalej" />
           </button>
           <p className="newsletter__success" ref={newsletterSuccess}>
                <span className="d-block">Dziękujemy za zapis do naszego newslettera!</span>
                <span className="d-block">Potwierdź swoją subskrypcję, a my wyślemy do Ciebie kod rabatowy z pięcioprocentową zniżką na pierwsze zakupy w Biostories!</span>
           </p>
        </section>
    </section>
};

export default Newsletter;
