import React, {useEffect, useState} from 'react'
import back from '../static/img/back.png'
import settings from "../helpers/settings";
import settingsIcon from '../static/img/settings_filled.svg'
import percent from '../static/img/discount.png'
import addCategory from '../static/img/list_ul.svg'
import add from '../static/img/add.svg'
import {getAllOrders} from "../helpers/orderFunctions";
import {getDate, getTime} from "../helpers/formatFunctions";
import exit from "../static/img/exit.svg";
import trash from "../static/img/trash.svg";
import {getAllProducts} from "../helpers/productFunctions";
import {getAllCategories} from "../helpers/categoriesFunctions";

const PanelStart = () => {
    const [orders, setOrders] = useState([]);
    const [sum, setSum] = useState(0);
    const [products, setProducts] = useState(0);
    const [categories, setCategories] = useState(0);

    useEffect(() => {
        getAllOrders()
            .then((res) => {
                 setOrders(res?.data?.result?.reverse());
            });

        getAllProducts()
            .then((res) => {
                setProducts(res?.data?.result?.length);
            });

        getAllCategories()
            .then((res) => {
                setCategories(res?.data?.result?.length);
            })
    }, []);

    useEffect(() => {
        if(orders) {
            setSum(orders.reduce((prev, current, index, arr) => {
                console.log(current);
                return prev + current.order_price;
            }, 0).toFixed(2));
        }
    }, [orders]);

    return <main className="panelContent panelContent--start">
        <header className="panelContent__header">
            <h1 className="panelContent__header__h">
                Witaj w panelu - tu możesz zarządzać swoim sklepem
            </h1>
        </header>
        <main className="panelContent__startContent">
            <div className="panelContent__frame panelContent__frame--orders">
                <header className="flex">
                    <h3 className="panelStart__header">
                        Ostatnie zamówienia
                    </h3>
                    <a className="panelStart__btn" href="/panel/zamowienia">
                        Wszystkie zamówienia
                    </a>
                </header>
                <main>
                    {orders?.map((item, index) => {
                        if(index < 3) {
                            return <section className="panelContent__item orderItem">
                                <section className="panelContent__column">
                                    <h4 className="panelContent__column__label">
                                        Id
                                    </h4>
                                    <h3 className="panelContent__column__value">
                                        #{item.id.substring(0, 6)}
                                    </h3>
                                </section>

                                <section className="panelContent__column">
                                    <h4 className="panelContent__column__label">
                                        Data zamówienia
                                    </h4>
                                    <h3 className="panelContent__column__value">
                            <span className="dateTime">
                                { getDate(item.date) }
                            </span>
                                        <span className="dateTime">
                                    { getTime(new Date(item.date).toString().substring(5, 1000)) }
                            </span>
                                    </h3>
                                </section>

                                <section className="panelContent__column">
                                    <h4 className="panelContent__column__label">
                                        Status zamówienia
                                    </h4>
                                    <h3 className="panelContent__column__value">
                                    <span className={item.order_status.toLowerCase() === "zrealizowane" ? "panelContent__column__status status--positive" : "panelContent__column__status status--negative"}>
                                {item.order_status}
                            </span>
                                    </h3>
                                </section>

                                <section className="panelContent__column">
                                    <h4 className="panelContent__column__label">
                                        Działania
                                    </h4>
                                    <div className="panelContent__column__value panelContent__column__value--buttons">
                                        <button className="panelContent__column__btn">
                                            <a className="panelContent__column__link" href={"/panel/szczegoly-zamowienia?id=" + item.id}>
                                                <img className="panelContent__column__icon" src={exit} alt="przejdz" />
                                            </a>
                                        </button>
                                    </div>
                                </section>

                            </section>
                        }
                        else {
                            return "";
                        }
                    })}
                </main>
            </div>

            <div className="panelContent__frame panelContent__frame--stats">
                <header className="flex">
                    <h3 className="panelStart__header panelStart__header--big">
                        Statystyki
                    </h3>
                </header>
                <h4 className="panelStart__subheader">
                    Sprzedaż
                </h4>
                <main className="panelStart__stats flex">
                    <div>
                        <span className="panelContent__column__label">
                            Złożone zamówienia
                        </span>
                        <h4>
                            {orders?.length}
                        </h4>
                    </div>
                    <div>
                        <span className="panelContent__column__label">
                            łączny obrót
                        </span>
                        <h4>
                            {sum} zł
                        </h4>
                    </div>
                </main>
                <h4 className="panelStart__subheader">
                    Asortyment
                </h4>
                <main className="panelStart__stats flex">
                    <div>
                        <span className="panelContent__column__label">
                            Liczba produktów
                        </span>
                        <h4>
                            {products}
                        </h4>
                    </div>
                    <div>
                        <span className="panelContent__column__label">
                            Liczba kategorii
                        </span>
                        <h4>
                            {categories}
                        </h4>
                    </div>
                </main>
            </div>

            <div className="panelContent__frame panelContent__frame--quick w-100 flex">
                <header className="flex">
                    <h3 className="panelStart__header panelStart__header--big">
                        Szybki dostęp
                    </h3>
                </header>
                <a className="quickBtn" href="/panel/dodaj-produkt">
                    <img className="icon" src={add} alt="dodaj" />
                    Dodaj nowy produkt
                </a>
                <a className="quickBtn" href="/panel/dodaj-kategorie">
                    <img className="icon" src={addCategory} alt="dodaj" />
                    Dodaj kategorię
                </a>
                <a className="quickBtn" href="/panel/ustawienia">
                    <img className="icon" src={settingsIcon} alt="dodaj" />
                    Ustawienia
                </a>
                <a className="quickBtn" href="/panel/kupony">
                    <img className="icon" src={settingsIcon} alt="dodaj" />
                    Dodaj kod rabatowy
                </a>
            </div>
        </main>
    </main>
}

export default PanelStart;
