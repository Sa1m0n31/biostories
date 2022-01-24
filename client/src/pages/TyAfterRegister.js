import React from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";

const TyAfterRegister = () => {
    return <div className="container">
        <Header />
        <TopMenu />
        <main className="page page--ty">
            <h2 className="ty__header">
                Twoje konto zostało pomyślnie założone!
            </h2>
            <h3 className="ty__subheader">
                Na podany adres e-mail wysłaliśmy wiadomość z linkiem weryfikacyjnym. Kliknij go i ciesz się zakupami w Bio Stories!
            </h3>
            <a className="btn btn--back" href="/logowanie">
                Zaloguj się
            </a>
        </main>
        <Footer />
    </div>
};

export default TyAfterRegister;
