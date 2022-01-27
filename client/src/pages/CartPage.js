import React, {useContext, useEffect, useState} from 'react';
import arrowBack from "../static/assets/arrow-back.svg";
import {CartContext} from "../App";
import {getProductStock} from "../admin/helpers/stockFunctions";
import arrowIcon from "../static/assets/arrow-right.svg";
import trashIcon from '../static/img/trash.png'

const CartPage = () => {
    const { cartContent, editCart, removeFromCart } = useContext(CartContext);

    const [sum, setSum] = useState(0);
    const [remove, setRemove] = useState(false);
    const [currentCart, setCurrentCart] = useState(cartContent);

    useEffect(() => {
        calculateCartSum();
    }, []);

    useEffect(() => {
        setCurrentCart(cartContent);
    }, [cartContent]);

    useEffect(() => {
        calculateCartSum();
        setCurrentCart(cartContent);
    }, [remove]);

    const calculateCartSum = () => {
        let sum = 0;
        currentCart.forEach((item, index, array) => {
            sum += item.price * item.amount;
            if(index === array.length-1) setSum(sum);
        });
    }

    useEffect(() => {
        calculateCartSum();
    }, [currentCart]);

    const changeAmountInCart = (value, uuid, id, attributeName, attributeValue) => {
        const cart = JSON.parse(localStorage.getItem('hideisland-cart'));

        if(value === "") {
            return 0;
        }

        getProductStock(id)
            .then(res => {
                if(res?.data?.result) {
                    const result = res.data.result[0].stock;
                    if(result >= parseInt(value)) {
                        localStorage.setItem('hideisland-cart', JSON.stringify(cart.map((item) => {
                            if(item.uuid === uuid) {
                                editCart(uuid, item.id, item.title, parseInt(value), item.img, item.attributeName, item.attributeValue, item.price);
                                return {
                                    uuid,
                                    id: item.id,
                                    img: item.img,
                                    attributeName: item.attributeName,
                                    attributeValue: item.attributeValue,
                                    price: item.price,
                                    title: item.title,
                                    amount: value
                                }
                            }
                            else return item;
                        })));

                        setCurrentCart(cart.map((item) => {
                            if(item.uuid === uuid) {
                                editCart(uuid, item.id, item.title, parseInt(value), item.img, item.attributeName, item.attributeValue, item.price);
                                return {
                                    uuid,
                                    id: item.id,
                                    img: item.img,
                                    attributeName: item.attributeName,
                                    attributeValue: item.attributeValue,
                                    price: item.price,
                                    title: item.title,
                                    amount: value
                                }
                            }
                            else return item;
                        }));
                    }
                    else {
                        return 0;
                    }
                }
            });
    }

    return <div className="page page--login page--beforeCheckout">
        <a className="page--beforeCheckout__back" href="/">
            <img className="icon" src={arrowBack} alt="wroc" />
            Powrót na stronę główną
        </a>
        <h1 className="page__header">
            Twoje zakupy
        </h1>
        <div className="cartPage__main w">
            {currentCart?.length ? currentCart.map((item, index) => {
                return <>
                    <div className="cart__item flex" key={index}>
                        <div className="cart__item__firstCol flex">
                            <figure className="cart__item__imgWrapper">
                                <img className="cart__item__img" src={item.img} alt={item.title} />
                            </figure>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Nazwa
                            </h4>
                            <h4 className="cartCol__value">
                                {item.title}
                            </h4>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Ilość
                            </h4>
                            <div className="cartCol__value">
                                <div className="cart__item__secondCol flex">
                                    <button className="cart__item__btn" onClick={() => { changeAmountInCart(Math.max(1, item.amount-1), item.uuid, item.id, item.attributeValue) }}>
                                        -
                                    </button>
                                    <h4 className="cart__item__count">
                                        {item.amount}
                                    </h4>
                                    <button className="cart__item__btn" onClick={() => { changeAmountInCart(item.amount+1, item.uuid, item.id, item.attributeValue) }}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="cartCol">
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
                                {item.price * item.amount} zł
                            </h4>
                        </div>
                        <div className="cartCol">
                            <h4 className="cartCol__key">
                                Działania
                            </h4>
                            <h4 className="cartCol__value">
                                <button className="cartCol__btn" onClick={() => { removeFromCart(item.uuid); }}>
                                    <img className="btn__img" src={trashIcon} alt="usun" />
                                </button>
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
            {currentCart?.length ? <>
                <div className="cart__sum cart__sum--cartPage flex w">
                    <h4>
                        Łączna wartość zamówienia
                    </h4>
                    <h5>
                        {sum} PLN
                    </h5>
                </div>
                <a className="btn btn--cart w" href="/dane-dostawy">
                    Przejdź dalej
                    <img className="icon" src={arrowIcon} alt="dalej" />
                </a>
            </> : ''}
        </div>
    </div>
};

export default CartPage;
