import React from 'react';
import closeIcon from '../static/img/close.png'
import arrowIcon from '../static/assets/arrow-right.svg'
import { closeCart } from "../helpers/others";
import example from '../static/assets/product-2.png'

const Cart = () => {
    return <div className="cart">
        <button className="cart__close" onClick={() => { closeCart(); }}>
            <img className="btn__img" src={closeIcon} alt="close"/>
        </button>
        <h3 className="cart__header">
            Twoje zakupy
        </h3>
        <div>
            <div className="cart__item flex">
                <div className="cart__item__firstCol flex">
                    <figure className="cart__item__imgWrapper">
                        <img className="cart__item__img" src={example} alt="tdas" />
                    </figure>
                    <h4 className="cart__item__title">
                        Naturalny krem liftingujący
                    </h4>
                </div>
                <div className="cart__item__secondCol flex">
                    <button className="cart__item__btn">
                        -
                    </button>
                    <h4 className="cart__item__count">
                        4
                    </h4>
                    <button className="cart__item__btn">
                        +
                    </button>
                </div>
                <h3 className="cart__item__price">
                    234.42 zł
                </h3>
            </div>
        </div>
        <div className="cart__sum flex">
            <h4>
                Łączna wartość zamówienia
            </h4>
            <h5>
                336 PLN
            </h5>
        </div>
        <a className="btn btn--cart" href="/zakupy">
            Przejdź dalej
            <img className="icon" src={arrowIcon} alt="dalej" />
        </a>
    </div>
};

export default Cart;
