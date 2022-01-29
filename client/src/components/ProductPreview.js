import React, {useContext, useEffect, useState} from 'react';
import plusIcon from '../static/assets/plus.svg'
import {openCart} from "../helpers/others";
import {CartContext} from "../App";
import {getDefaultAttribute} from "../helpers/productFunctions";

const ProductPreview = ({id, title, subtitle, link, price, img1, img2}) => {
    const { cartContent, addToCart } = useContext(CartContext);

    const [attributeName, setAttributeName] = useState(null);
    const [attributeValue, setAttributeValue] = useState(null);

    useEffect(() => {
        getDefaultAttribute(id)
            .then((res) => {
                const result = res?.data?.result;
                if(result) {
                    setAttributeName(result.name);
                    setAttributeValue(result.value)
                }
            });
    }, [id]);

    return <a className="preview" href={`/produkt/${link}`}>
        <figure className="preview__imgWrapper">
            <img className="btn__img previewImg1" src={img1} alt={title} />
            <img className="btn__img previewImg2" src={img2} alt={title} />
        </figure>
        <h3 className="preview__title">
            {title}
        </h3>
        <h4 className="preview__subtitle">
            {subtitle}
        </h4>
        <h5 className="preview__price">
            {price} zł
        </h5>
        <button className="addToCartBtn w-100" onClick={(e) => {
            e.preventDefault();
            addToCart(id, title, 1, img1, attributeName, attributeValue, price);
            openCart();
        }}>
            Do koszyka
            <img className="addToCartBtn__img" src={plusIcon} alt="dodaj" />
        </button>
    </a>
};

export default ProductPreview;
