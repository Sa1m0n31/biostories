import React, {useEffect, useState} from 'react';
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import Header from "../components/Header";
import logo from '../static/assets/logo.png'
import settings from "../helpers/settings";
import {getOrderDetails} from "../admin/helpers/orderFunctions";

const TyPage = () => {
    const [order, setOrder] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
       if(render) {
           const animation = document.querySelector('.circle-fill');
           animation.classList.add('startAnimation');
           setTimeout(() => {
               document.querySelector('.animation__logo').style.opacity = '1';
               setTimeout(() => {
                   document.querySelector('.ty__content').style.opacity = '1';
               }, 1000);
           }, 3000);
       }
    }, [render]);

    useEffect(() => {
        if(localStorage.getItem('order-id')) {
            // localStorage.removeItem('order-id');
            getOrderDetails(localStorage.getItem('order-id'))
                .then((res) => {
                    setOrder(res?.data?.result);
                    setRender(true);
                });
        }
        else {
            window.location = '/'
        }
    }, []);

    return <div className="container">
        <Header topSmall={true} />
        <TopMenu />
        {render ? <main className="page page--ty page--ty--noMargin page--cart">
            <div className="animation center">
                <div className="circle circle-outer-border animated">
                    <div className="circle circle-fill"></div>
                    <img className="btn__img animation__logo" src={logo} alt="bio-stories" />
                </div>
            </div>
            <main className="ty__content">
                {order ?  <h2 className="page__header page__header--left ty__header">
                    Dziękujemy za złożenie zamówienia ID #{order[0]?.id?.substring(0, 6)}
                </h2> : ''}
                <h3 className="ty__smallHeader">
                    Będziemy Cię informować o etapach realizacji Twojego zamówienia
                </h3>
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
                                    {item.attribute_price ? item.attribute_price : item.price} zł
                                </h4>
                            </div>
                            <div className="cartCol">
                                <h4 className="cartCol__key">
                                    Wartość zamówienia
                                </h4>
                                <h4 className="cartCol__value">
                                    {(item.attribute_price ? item.attribute_price : item.price) * item.quantity} zł
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
        </main> : ''}
        <Footer />
    </div>
};

export default TyPage;
