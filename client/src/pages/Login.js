import React, {useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import arrowIcon from "../static/assets/arrow-right.svg";
import {loginUser} from "../helpers/userFunctions";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        loginUser(email, password)
            .then((res) => {
                if(res?.data?.result) window.location = '/sklep';
                else {
                    setError('Niepoprawna nazwa użytkownika, niepoprawne hasło lub nieaktywowane konto');
                }
            })
            .catch((err) => {
                setError('Niepoprawna nazwa użytkownika, niepoprawne hasło lub nieaktywowane konto');
            });
    }

    return <div className="container">
        <Header />
        <TopMenu />
        <menu className="page page--login">
            <h1 className="page__header">
                Panel klienta
            </h1>
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
            <button className="afterLogin">
                Nie pamiętasz hasła?
            </button>
            <h4 className="afterLogin">
                Nie masz konta? <a href="/rejestracja">Zarejestruj się</a>
            </h4>
        </menu>
        <Footer />
    </div>
};

export default Login;
