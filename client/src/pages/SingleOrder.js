import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getOrderDetails} from "../admin/helpers/orderFunctions";
import trashIcon from "../static/img/trash.png";
import settings from "../helpers/settings";

const SingleOrder = () => {
    const [render, setRender] = useState(false);
    const [order, setOrder] = useState(false);

    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('id');
        if(id) {
            getOrderDetails(id)
                .then((res) => {
                   console.log(res?.data?.result);
                   setOrder(res?.data?.result);
                   setRender(true);
                });
        }
        else {
            window.location = '/'
        }
    }, []);

    return <div className="container">
        <Header topSmall={true} restricted={true} />
        <TopMenu />
        <main className="page page--singleOrder page--cart">
            {order ? <h1 className="page__header">
                Zamówienie #{order[0]?.id?.substring(0, 6)}
            </h1> : ''}

            {order?.length ? order.map((item, index) => {
                return <>
                    <div className="cart__item flex" key={index}>
                        <div className="cart__item__firstCol flex">
                            <figure className="cart__item__imgWrapper">
                                <img className="cart__item__img" src={`${settings.API_URL}/image?url=/media/products/${item.main_image}`} alt={item.title} />
                            </figure>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Nazwa
                            </h4>
                            <h4 className="cartCol__value">
                                {item.name}
                                {item.attribute_name ? <span className="cart__item__attribute">
                                    {item.attribute_name}: {item.attribute_value}
                                </span> : ''}
                            </h4>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Ilość
                            </h4>
                            <div className="cartCol__value">
                                <div className="cart__item__secondCol flex">
                                    <h4 className="cart__item__count">
                                        {item.quantity}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="cartCol d-900">
                            <h4 className="cartCol__key">
                                Cena jednostkowa
                            </h4>
                            <h4 className="cartCol__value">
                                {item.price} zł
                            </h4>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Wartość zamówienia
                            </h4>
                            <h4 className="cartCol__value">
                                {item.price * item.quantity} zł
                            </h4>
                        </div>
                    </div>
                </>
            }) : <div className="emptyCart">
                <h3 className="emptyCart__header">
                    Twój koszyk jest pusty
                </h3>
                <a className="btn btn--back" href="/">
                    Wróć na stronę główną
                </a>
            </div>}

            <section className="order__bottom flex">
                <section className="order__bottom__left">
                    <h3 className="order__bottom__left__header">
                        Dane osobowe
                    </h3>
                    <section>
                        <span>{order?.length ? order[0].first_name + ' ' + order[0].last_name : ''}</span>
                        <span>{order?.length ? order[0].email : ''}</span>
                        <span>{order?.length ? order[0].phone_number : ''}</span>
                    </section>
                    <section className="mt-4">
                        <span><b>Sposób dostawy: </b>{order?.length ? order[0].shipping : ''}</span>
                        <span><b>Adres dostawy: </b></span>
                        <span>
                             {order?.length ? (order[0].shipping === 'Paczkomaty InPost' ? order[0].inpost_address : order[0].street + " " + order[0].building + (order[0].flat ? '/' + order[0].flat : '')) : ''}
                        </span>
                        <span>
                            {order?.length ? (order[0].shipping === 'Paczkomaty InPost' ? order[0].inpost_postal_code + ' ' + order[0].inpost_city : order[0].postal_code + ' ' + order[0].city) : ''}
                        </span>
                    </section>
                    <section className="mt-4">
                        <span><b>Status zamówienia: </b>{order?.length ? order[0].order_status : ''}</span>
                    </section>
                </section>
                <section className="order__bottom__right">
                    <a className="btn btn--order" href="/">
                        Powrót na stronę główną
                    </a>
                    <a className="btn btn--order" href="/moje-konto">
                        Panel klienta
                    </a>
                </section>
            </section>
        </main>
        <Footer />
    </div>
};

export default SingleOrder;
