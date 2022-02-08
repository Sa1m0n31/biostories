import React, {useEffect, useState} from 'react'
import axios from "axios";
import settings from "../helpers/settings";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Loader from "../../components/Loader";
import TopMenu from "../../components/TopMenu";

const SubscriptionValidationPage = () => {
    const [loaded, setLoaded] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if(!token) {
            window.location = "/";
        }
        else {
            axios.post(`${settings.API_URL}/newsletter/verify-subscription`, {
                token
            })
                .then((res) => {
                    if(res?.data?.result) setLoaded(true);
                    else window.location = "/";
                });
        }
    }, []);

    return <div className="container">
        <Header />
        <TopMenu />
        {loaded ? <main className="page page--ty pb-5">
            <h1 className="page__header page__header--ty pt-5">
                Twoja subskrypcja newslettera została aktywowana. Na mailu znajdziesz swój kod rabatowy na pierwsze zakupy w BIO STORIES!
            </h1>

            <a className="btn btn--back" href="/">
                Wróć na stronę główną
            </a>
        </main> : <Loader />}
        <Footer />
    </div>
}

export default SubscriptionValidationPage;
