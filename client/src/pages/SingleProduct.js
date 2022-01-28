import React, {useContext, useEffect, useState} from 'react';
import Header from "../components/Header";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getProductByName, getProductGallery, getProductIcons} from "../helpers/productFunctions";
import {convertToString} from "../helpers/convertToURL";
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import settings from "../helpers/settings";
import {openCart} from "../helpers/others";
import plusIcon from "../static/assets/plus.svg";
import {CartContext} from "../App";

const SingleProduct = () => {
    const { cartContent, addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [attributeName, setAtributeName] = useState(null);
    const [attributeValues, setAttributeValues] = useState([]);
    const [gallery, setGallery] = useState([]);
    const [icons, setIcons] = useState([]);

    const [desc1, setDesc1] = useState(null);
    const [desc2, setDesc2] = useState(null);
    const [desc3, setDesc3] = useState(null);
    const [desc4, setDesc4] = useState(null);

    const [amount, setAmount] = useState(1);

    useEffect(() => {
        /* Get product info */
        getProductByName(convertToString(window.location.pathname.split("/")[2]))
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    const productInfo = result[0];
                    if(productInfo.description) setDesc1(stateToHTML((convertFromRaw(JSON.parse(productInfo.description)))));
                    if(productInfo.second_description) setDesc2(stateToHTML((convertFromRaw(JSON.parse(productInfo.second_description)))));
                    if(productInfo.third_description) setDesc3(stateToHTML((convertFromRaw(JSON.parse(productInfo.third_description)))));
                    if(productInfo.fourth_description) setDesc4(stateToHTML((convertFromRaw(JSON.parse(productInfo.fourth_description)))));

                    setProduct(productInfo);

                    /* Get product gallery */
                    getProductGallery(productInfo.id)
                        .then(res => {
                            const galleryResult = res.data?.result;
                            if(galleryResult) {
                                setGallery(galleryResult);
                            }
                        });

                    getProductIcons(productInfo.id)
                        .then(res => {
                            const galleryResult = res.data?.result;
                            if(galleryResult) {
                                setIcons(res?.data?.result);
                            }
                        });
                }
            });
    }, []);

    return <div className="container container--single">
        <Header topSmall={true} />
        <TopMenu />
        <main className="page page--single">
            <section className="single__top flex">
                <div className="single__gallery">

                </div>
                <main className="single__mainInfo">
                    <header className="single__header flex">
                        <h2 className="single__title">
                            {product?.name}
                        </h2>
                        <h2 className="single__price">
                            {product?.price} zł
                        </h2>
                    </header>
                    <article className="single__desc" dangerouslySetInnerHTML={{__html: desc1}}>

                    </article>
                    <div className="single__row flex">
                        {icons ? <div className="single__icons flex">
                            <h3 className="smallHeader">
                                Informacje:
                            </h3>
                            {icons.map((item, index) => {
                                return <img className="single__icons__item" src={`${settings.API_URL}/image?url=/media/products/${item.file_path}`} alt="info" />
                            })}
                        </div> : ""}
                        <div className="flex">
                            <h3 className="smallHeader">
                                Ilość:
                            </h3>
                            <div className="cart__item__secondCol flex">
                                <button className="cart__item__btn" onClick={() => { setAmount(amount-1); }}>
                                    -
                                </button>
                                <h4 className="cart__item__count">
                                    {amount}
                                </h4>
                                <button className="cart__item__btn" onClick={() => { setAmount(amount+1); }}>
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <button className="addToCartBtn addToCartBtn--single w-100" onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.id, product.name, amount, `${settings.API_URL}/image?url=/media/products/${product.main_image}`, 'a', 'a', product.price);
                        openCart();
                    }}>
                        Do koszyka
                        <img className="addToCartBtn__img" src={plusIcon} alt="dodaj" />
                    </button>
                </main>
            </section>
            {desc2 ? <section className="singleMiddle">
                {product?.third_image ? <figure className="singleMiddle__imgWrapper">
                    <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${product.third_image}`} alt={product.name} />
                </figure> : ''}
                <article className="single__desc" dangerouslySetInnerHTML={{__html: desc2}}>

                </article>
            </section> : ''}
            {desc3 ? <section className="singleBottom">

            </section> : ''}
        </main>
        <Footer />
    </div>
};

export default SingleProduct;
