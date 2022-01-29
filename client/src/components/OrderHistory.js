import React, {useEffect, useState} from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";
import {getUserOrders} from "../helpers/userFunctions";
import Loader from "./Loader";
import exitIcon from '../admin/static/img/exit.svg'

const OrderHistory = ({user}) => {
    const [orders, setOrders] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        if(user) {
            getUserOrders(user.email)
                .then((res) => {
                    setOrders(res?.data?.result);
                    setRender(true);
                });
        }
    }, [user]);

    return <section className="myAccount__section">
        <h2 className="myAccount__header">
            Ostatnie zamówienia
        </h2>
        {render ?  <main>
            {orders?.length ? orders.map((item, index) => {
                if(index < 2) {
                    return <section className="singleOrder flex" key={index}>
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
                }
            }) : <h3 className="noProducts">
                Póki co, nie masz jeszcze żadnych zamówień...
            </h3> }
        </main> : <Loader />}
        {orders?.length ? <a className="btn btn--cart btn--myAccount" href="/historia-zamowien">
            Zobacz wszystkie zamówienia
            <img className="icon" src={arrowIcon} alt="dalej" />
        </a> : ''}
    </section>
};

export default OrderHistory;
