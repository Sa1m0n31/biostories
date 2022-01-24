import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {verifyUser} from "../helpers/userFunctions";

const VerificationPage = () => {
    const [render, setRender] = useState(false);

    useEffect(() => {
        const token = new URLSearchParams(window.location.search).get('token');

        if(token) {
            verifyUser(token)
                .then((res) => {
                    if(res?.data?.result) {
                        setRender(true);
                    }
                    else {
                        window.location = '/';
                    }
                });
        }
        else {
            window.location = '/';
        }
    }, []);

    return <div className="container">
        {render ? <>
            <Header />
            <TopMenu />
            <main className="page page--ty">
                <h2 className="ty__header">
                    Twoje konto zostało aktywowane!
                </h2>
                <h3 className="ty__subheader">
                    Zaloguj się na swoje konto i ciesz się zakupami w Bio Stories!
                </h3>
                <a className="btn btn--back" href="/logowanie">
                    Zaloguj się
                </a>
            </main>
            <Footer />
        </> : ''}
    </div>
};

export default VerificationPage;
