import React from 'react';
import arrowIcon from "../static/assets/arrow-right.svg";

const OrderHistory = () => {
    return <section className="myAccount__section">
        <h2 className="myAccount__header">
            Historia zamówień
        </h2>
        <main>

        </main>
        <button className="btn btn--cart btn--myAccount">
             Zobacz wszystkie zamówienia
            <img className="icon" src={arrowIcon} alt="dalej" />
        </button>
    </section>
};

export default OrderHistory;
