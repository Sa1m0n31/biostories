import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import auth from "../admin/helpers/auth";
import OrderHistory from "../components/OrderHistory";
import ChangePassword from "../components/ChangePassword";
import PersonalData from "../components/PersonalData";
import DeliveryData from "../components/DeliveryData";
import {getUserData} from "../helpers/userFunctions";

const MyAccount = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserData()
            .then((res) => {
                setUser(res?.data?.result);
            });
    }, []);

    return <div className="container container--myAccount">
        <Header topSmall={true} restricted={true} />
        <TopMenu />
        <main className="page page--myAccount">
            <h1 className="page__header">
                Panel klienta
            </h1>
            <main className="myAccount__main flex">
                <OrderHistory />
                <ChangePassword />
                <PersonalData user={user} />
                <DeliveryData user={user} />
            </main>
        </main>
        <Footer />
    </div>
};

export default MyAccount;
