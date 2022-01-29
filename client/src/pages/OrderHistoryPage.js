import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getUserData, getUserOrders} from "../helpers/userFunctions";
import auth from "../admin/helpers/auth";
import exitIcon from "../admin/static/img/exit.svg";
import Loader from "../components/Loader";

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        getUserData()
            .then((res) => {
                if(res?.data?.result) {
                    getUserOrders(res?.data?.result?.email)
                        .then((res) => {
                            setOrders(res?.data?.result);
                            setRender(true);
                        });
                }
            });
    }, []);

    return <div className="container container--orderHistory">
        <Header topSmall={true} />
        <TopMenu />
        {render ?  <main>
            <h1 className="page__header">
                Historia zamówień ({orders?.length})
            </h1>
            {orders?.length ? orders.map((item, index) => {
                return <section className="singleOrder flex">
                    <div className="singleOrder__col">
                        <h4 className="singleOrder__key">
                            ID zamówienia
                        </h4>
                        <h5 className="singleOrder__value">
                            #{item.order_id.substring(0,6)}
                        </h5>
                    </div>
                    <div className="singleOrder__col">
                        <h4 className="singleOrder__key">
                            Wartość
                        </h4>
                        <h5 className="singleOrder__value">
                            {item.order_price} zł
                        </h5>
                    </div>
                    <div className="singleOrder__col">
                        <h4 className="singleOrder__key">
                            Status
                        </h4>
                        <h5 className="singleOrder__value">
                            {item.order_status}
                        </h5>
                    </div>
                    <div className="singleOrder__col">
                        <h4 className="singleOrder__key">
                            Działania
                        </h4>
                        <a className="singleOrder__btn" href="/zamowienie">
                            <img className="btn__img" src={exitIcon} alt="zobacz" />
                        </a>
                    </div>
                </section>
            }) : <h3 className="noProducts">
                Póki co, nie masz jeszcze żadnych zamówień...
            </h3> }
        </main> : <Loader />}
        <Footer />
    </div>
};

export default OrderHistoryPage;
