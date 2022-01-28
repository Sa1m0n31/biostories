import React, {useEffect, useState} from 'react';
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import Header from "../components/Header";

const TyPage = () => {
    const [orderId, setOrderId] = useState(localStorage.getItem('order-id'));
    const [orderContent, setOrderContent] = useState([]);

    useEffect(() => {
        if(orderId) {
            localStorage.removeItem('order-id');
        }
        else {

        }
    }, [orderId]);

    return <div className="container">
        <Header topSmall={true} />
        <TopMenu />

        <Footer />
    </div>
};

export default TyPage;
