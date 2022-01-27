import React, {useContext, useEffect, useState} from 'react';
import closeIcon from '../static/img/close.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import { closeCart } from "../helpers/others";
import example from '../static/assets/product-2.png'
import {CartContext} from "../App";
import {getProductStock} from "../admin/helpers/stockFunctions";
import settings from "../helpers/settings";

const Cart = ({deliveryProp}) => {
    const { cartContent, editCart, removeFromCart } = useContext(CartContext);

    const [sum, setSum] = useState(0);
    const [remove, setRemove] = useState(false);
    const [currentCart, setCurrentCart] = useState(cartContent);
    const [delivery, setDelivery] = useState(0);

    useEffect(() => {
        calculateCartSum();
    }, []);

    useEffect(() => {
        if(deliveryProp) {
            setDelivery(deliveryProp);
        }
    }, [deliveryProp]);

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

    return <div className="cart">
        <button className="cart__close" onClick={() => { closeCart(); }}>
            <img className="btn__img" src={closeIcon} alt="close"/>
        </button>
        <h3 className="cart__header">
            Twoje zakupy
        </h3>
        <div>
            {currentCart?.length ? currentCart?.map((item, index) => {
                return <div className="cart__item flex" key={index}>
                    <div className="cart__item__firstCol flex">
                        <figure className="cart__item__imgWrapper">
                            <img className="cart__item__img" src={item.img} alt={item.title} />
                        </figure>
                        <h4 className="cart__item__title">
                            {item.title}
                        </h4>
                    </div>
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
                    <h3 className="cart__item__price">
                        {item.price} zł
                    </h3>
                </div>
            }) : <div className="emptyCart emptyCart--right">
                <h3 className="emptyCart__header">
                    Twój koszyk jest pusty
                </h3>
            </div>}
        </div>
       <div className={currentCart?.length ? "cart__sumWrapper" : "hidden"}>
            <div className="cart__sum cart__sum--noBorder flex">
                <h4>
                    Wartość koszyka
                </h4>
                <h5>
                    {sum} PLN
                </h5>
            </div>
            <div className="cart__sum cart__sum--noBorder flex">
                <h4>
                    Dostawa
                </h4>
                <h5>
                    {delivery} PLN
                </h5>
            </div>
            <div className="cart__sum flex">
                <h4>
                    Łączna wartość zamówienia
                </h4>
                <h5>
                    {sum + delivery} PLN
                </h5>
            </div>
            <a className="btn btn--cart" href="/zakupy">
                Przejdź dalej
                <img className="icon" src={arrowIcon} alt="dalej" />
            </a>
            <a className="btn btn--cart btn--payment" href="/zakupy">
                Zamawiam i płacę
                <img className="icon" src={arrowIcon} alt="dalej" />
            </a>
        </div>
    </div>
};

export default Cart;
