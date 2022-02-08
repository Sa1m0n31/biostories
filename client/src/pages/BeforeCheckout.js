import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import {loginUser} from "../helpers/userFunctions";
import arrowBack from '../static/assets/arrow-back.svg'

const BeforeCheckout = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(email, password)
            .then((res) => {
                if(res?.data?.result) window.location = '/koszyk';
                else {
                    setError('Niepoprawna nazwa użytkownika, niepoprawne hasło lub nieaktywowane konto');
                }
            });
    }

    return <div className="page page--login page--beforeCheckout">
        <div className="page--beforeCheckout__backWrapper">
            <a className="page--beforeCheckout__back" href="/sklep">
                <img className="icon" src={arrowBack} alt="wroc" />
                Wróć
            </a>
        </div>
        <h1 className="page__header">
            Zaloguj się lub kontynuuj bez rejestracji
        </h1>
        <main className="flex">
            <div>
                <h2 className="page__header">
                    Logowanie
                </h2>
                <form className="form"
                      onSubmit={(e) => { handleSubmit(e); }}>
                    <label>
                        <input className="input"
                               value={email}
                               onChange={(e) => { setEmail(e.target.value); }}
                               placeholder="Adres e-mail" />
                    </label>
                    <label>
                        <input className="input"
                               type="password"
                               value={password}
                               onChange={(e) => { setPassword(e.target.value); }}
                               placeholder="Hasło" />
                    </label>
                    <button className="btn btn--submit"
                            type="submit">
                        Zaloguj się
                        <img className="icon" src={arrowIcon} alt="dalej" />
                    </button>
                </form>
                {error ? <h4 className="error">
                    {error}
                </h4> : ""}
                {/*<button className="afterLogin">*/}
                {/*    Nie pamiętasz hasła?*/}
                {/*</button>*/}
            </div>
            <span className="beforeCheckoutDivider"></span>
            <div>
                <h2 className="page__header page__header--left">
                    Zamawiam bez rejestracji
                </h2>
                <p>
                    Na pewno nie chcesz założyć u nas konta? Zalogowani użytkownicy zyskują szereg udogodnień, takich jak:
                </p>
                <ul>
                    <li>
                        dostęp do historii wszystkich zakupów,
                    </li>
                    <li>
                        podgląd statusu realizacji zamówień,
                    </li>
                    <li>
                        brak konieczności każdorazowego uzupełniania swoich danych.
                    </li>
                </ul>
                <p>
                    Zmieniłeś swoje zdanie? <a href="/rejestracja">Załóż konto już teraz!</a>
                </p>
                <a className="btn btn--submit btn--continue" href="/koszyk">
                     Kontynuuj bez rejestracji
                    <img className="icon" src={arrowIcon} alt="dalej" />
                </a>
            </div>
        </main>
    </div>
};

export default BeforeCheckout;
