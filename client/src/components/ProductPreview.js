import React from 'react';
import plusIcon from '../static/assets/plus.svg'
import {openCart} from "../helpers/others";

const ProductPreview = ({title, subtitle, link, price, img1, img2}) => {
    return <a className="preview" href={link}>
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
        <button className="addToCartBtn w-100" onClick={() => { openCart(); }}>
            Do koszyka
            <img className="addToCartBtn__img" src={plusIcon} alt="dodaj" />
        </button>
    </a>
};

export default ProductPreview;
