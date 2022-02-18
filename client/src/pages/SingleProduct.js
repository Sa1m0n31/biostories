import React, {useContext, useEffect, useRef, useState} from 'react';
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
import closeIcon from '../static/img/close.png'
import arrowIcon from '../static/img/arrow-white.svg'
import HomepagePopular from "../components/HomepagePopular";
import Loader from "../components/Loader";
import SimilarProducts from "../components/SimilarProducts";
import axios from "axios";

const SingleProduct = () => {
    const { cartContent, addToCart } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [attribute, setAttribute] = useState(null);
    const [attributeValues, setAttributeValues] = useState([]);
    const [icons, setIcons] = useState([]);
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(2);

    const [desc1, setDesc1] = useState(null);
    const [desc2, setDesc2] = useState(null);
    const [desc3, setDesc3] = useState(null);
    const [desc4, setDesc4] = useState(null);
    const [amount, setAmount] = useState(1);
    const [render, setRender] = useState(false);
    const [initial, setInitial] = useState(true);
    const [notificationInput, setNotificationInput] = useState(false);
    const [email, setEmail] = useState("");
    const [notificationStatus, setNotificationStatus] = useState("");

    const [container, setContainer] = useState(null);
    const [closeModalBtn, setCloseModalBtn] = useState(null);
    const [currentImage, setCurrentImage] = useState(0);
    const [gallery, setGallery] = useState([]);

    const galleryModal = useRef(null);
    const modalImgWrapper = useRef(null);

    useEffect(() => {
        /* Get product info */
        getProductByName(convertToString(window.location.pathname.split("/")[2]))
            .then(res => {
                const result = res.data?.result;
                if(result) {
                    const productInfo = result[0];
                    if(productInfo) {
                        const filteredAttributeValues = result?.map((item) => {
                            return {
                                value: item.attribute_value,
                                price: item.attribute_price,
                                stock: item.attribute_stock
                            }
                        }).filter((item) => {
                            return item.stock > 0
                        });
                        setAttributeValues(filteredAttributeValues);
                        setPrice(result[0]?.attribute_price ? result[0].attribute_price : productInfo.price);
                        setAttribute(filteredAttributeValues?.length ? filteredAttributeValues[0].value : null);
                        if(result?.length > 1 && filteredAttributeValues?.length === 0) {
                            setStock(0);
                        }
                        else {
                            setStock(filteredAttributeValues?.length ? filteredAttributeValues[0].stock : productInfo.stock);
                        }

                        let options = {
                            entityStyleFn: (entity) => {
                                const entityType = entity.get('type');
                                if (entityType === "EMBEDDED_LINK") {
                                    const data = entity.getData();
                                    return {
                                        element: 'iframe',
                                        attributes: {
                                            width: 500,
                                            height: 250,
                                            src: data.src,
                                        },
                                    };
                                }
                                return null;
                            }
                        }

                        if(productInfo.description && productInfo.description !== '0') setDesc1(stateToHTML((convertFromRaw(JSON.parse(productInfo.description))), options));
                        if(productInfo.second_description && productInfo.second_description !== '0') setDesc2(stateToHTML((convertFromRaw(JSON.parse(productInfo.second_description))), options));
                        if(productInfo.third_description && productInfo.third_description !== '0') setDesc3(stateToHTML((convertFromRaw(JSON.parse(productInfo.third_description))), options));
                        if(productInfo.fourth_description && productInfo.fourth_description !== '0') setDesc4(stateToHTML((convertFromRaw(JSON.parse(productInfo.fourth_description))), options));

                        setProduct(productInfo);

                        /* Get product gallery */
                        getProductGallery(productInfo.id)
                            .then(res => {
                                const galleryResult = res.data?.result;
                                setRender(true);
                                if(galleryResult) {
                                    setGallery(galleryResult);

                                    setContainer(document.querySelector('.container'));
                                    setCloseModalBtn(document.querySelector('.closeModalBtn'));
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
                }
            });
    }, []);

    useEffect(() => {
        console.log(desc1);
    }, [desc1]);

    const closeModal = () => {
        galleryModal.current.style.opacity = '0';
        setTimeout(() => {
            galleryModal.current.style.zIndex = '-1';
            galleryModal.current.style.visibility = 'hidden';
        }, 500);
    }

    const openModal = (n) => {
        setCurrentImage(n);
        galleryModal.current.style.opacity = '1';
        galleryModal.current.style.zIndex = '101';
        galleryModal.current.style.visibility = 'visible';
    }

    const animation = () => {
        modalImgWrapper.current.style.opacity = '0';
        setTimeout(() => {
            modalImgWrapper.current.style.opacity = '1';
        }, 300);
    }

    const nextImage = () => {
        animation();
        setTimeout(() => {
            setCurrentImage((prevState) => {
                if(prevState === gallery.length-1) return 0;
                else return prevState+1;
            });
        }, 200);
    }

    const prevImage = () => {
        animation();
        setTimeout(() => {
            setCurrentImage((prevState) => {
                if(prevState === 0) return gallery.length-1;
                else return prevState-1;
            });
        }, 200);
    }

    const getPriceByAttributeName = (val) => {
        return attributeValues.find((item) => {
            return item.value === val;
        })?.price;
    }

    useEffect(() => {
        if(initial) setInitial(false);
        else setPrice(getPriceByAttributeName(attribute));
    }, [attribute]);

    const addNotification = (e) => {
        e.preventDefault();
        if(email) {
            console.log(product);
            axios.post(`${settings.API_URL}/notification/add`, {
                productId: product.id,
                email: email
            })
                .then(res => {
                    if(res.data?.result) setNotificationStatus("Poinformujemy Cię drogą mailową, gdy Twój produkt będzie dostępny!");
                    else setNotificationStatus("Coś poszło nie tak... Prosimy spróbować później");
                });
        }
        else {
            setNotificationStatus("Wpisz poprawny adres email");
        }
    }

    return <div className="container container--single">
        <Header topSmall={true} />
        <TopMenu />

        <div className="galleryModal" ref={galleryModal}>
            <button className="closeModalBtn" onClick={() => { closeModal(); }}>
                <img className="btn__img" src={closeIcon} alt="wyjdz" />
            </button>

            <button className="modal__arrow modal__arrow--prev"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                <img className="btn__img" src={arrowIcon} alt="poprzedni" />
            </button>
            {gallery?.length ? <figure className="modalImgWrapper"
                                       ref={modalImgWrapper}
                                       onClick={(e) => { e.stopPropagation(); }}>
                <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${gallery[currentImage].file_path}`} alt="zdjecie" />
            </figure> : ''}
            <button className="modal__arrow modal__arrow--next"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                <img className="btn__img" src={arrowIcon} alt="poprzedni" />
            </button>
        </div>
        {render ? <main className="page page--single">
            <section className="single__top flex">
                <div className="single__gallery">
                    {gallery?.length ? <button className="single__gallery__main" onClick={() => { openModal(0); }}>
                        <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${gallery[0].file_path}`} alt={product.name} />
                    </button> : ''}
                    <div className="single__gallery__bottom flex">
                        {gallery?.map((item, index) => {
                            if(index > 0 && index < 4) {
                                return <button className="single__gallery__bottom__item" onClick={() => { openModal(index); }}>
                                    <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${item.file_path}`} alt={product.name} />
                                </button>
                            }
                        })}
                    </div>
                </div>
                <main className="single__mainInfo">
                    <header className="single__header flex">
                        <h2 className="single__title">
                            {product?.name}
                        </h2>
                        <h2 className="single__price">
                            {price} zł
                        </h2>
                    </header>
                    <article className="single__desc" dangerouslySetInnerHTML={{__html: desc1}}>

                    </article>
                    <div className="single__row flex">
                        {icons?.length ? <div className="single__icons flex">
                            <h3 className="smallHeader">
                                Informacje:
                            </h3>
                            {icons.map((item, index) => {
                                return <img className="single__icons__item" src={`${settings.API_URL}/image?url=/media/products/${item.file_path}`} alt="info" />
                            })}
                        </div> : ""}
                        <div className="flex">
                            {stock > 0 ? <><h3 className="smallHeader">
                                Ilość:
                            </h3>
                                <div className="cart__item__secondCol flex">
                                <button className="cart__item__btn" onClick={() => { setAmount(Math.max(1, amount-1)); }}>
                                    -
                                </button>
                                <h4 className="cart__item__count">
                                    {amount}
                                </h4>
                                <button className="cart__item__btn" onClick={() => { if(amount+1 <= stock) setAmount(amount+1); }}>
                                    +
                                </button>
                            </div></> : <div className="outOfStock">
                                <h4 className="outOfStock__header">
                                    Produkt niedostępny
                                </h4>
                                {!notificationStatus ? (notificationInput ? <div className="notificationForm flex">
                                    <label>
                                        <input className="input"
                                               placeholder="Wpisz swój adres email"
                                               value={email}
                                               onChange={(e) => { setEmail(e.target.value); }} />
                                    </label>
                                    <button className="addToCartBtn outOfStock__formSubmit" onClick={(e) => { addNotification(e); }}>
                                        Powiadom mnie
                                    </button>
                                </div>:  <button className="addToCartBtn addToCartBtn--single w-100 outOfStock__btn" onClick={() => { setNotificationInput(true); }}>
                                    Powiadom mnie, gdy produkt będzie dostępny
                                </button>) : <h3 className="notificationStatus">
                                    {notificationStatus}
                                </h3> }
                            </div>}
                        </div>
                    </div>
                    {attributeValues?.length && product?.attribute_name ? <div className="single__icons single__icons--attributeSection flex">
                        <h3 className="smallHeader">
                            {product.attribute_name}:
                        </h3>
                        <select onChange={(e) => { setAttribute(e.target.value); }}>
                            {attributeValues.map((item, index) => {
                                return <option key={index}>
                                    {item.value}
                                </option>
                            })}
                        </select>
                    </div> : ""}
                    {stock > 0 ? <button className="addToCartBtn addToCartBtn--single w-100" onClick={(e) => {
                        e.preventDefault();
                        addToCart(product.id, product.name, amount, `${settings.API_URL}/image?url=/media/products/${product.main_image}`, product.attribute_name ? product.attribute_name : '', attribute ? attribute : '', price);
                        openCart();
                    }}>
                        Do koszyka
                        <img className="addToCartBtn__img" src={plusIcon} alt="dodaj" />
                    </button> : ""}
                </main>
            </section>
            {desc2 ? <section className="singleMiddle flex">
                {product?.third_image ? <figure className="singleMiddle__imgWrapper">
                    <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${product.third_image}`} alt={product.name} />
                </figure> : ''}
                <article className="single__desc" dangerouslySetInnerHTML={{__html: desc2}}>

                </article>
            </section> : ''}
            <div className="singleBottom">
                {desc3 ? <section className="singleBottom__section flex">
                    {product?.fourth_image ? <figure className="singleMiddle__imgWrapper">
                        <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${product.fourth_image}`} alt={product.name} />
                    </figure> : ''}
                    <article className="single__desc" dangerouslySetInnerHTML={{__html: desc3}}>

                    </article>
                </section> : ''}
                {desc4 ? <section className="singleBottom__section flex">
                    {product?.fifth_image ? <figure className="singleMiddle__imgWrapper">
                        <img className="btn__img" src={`${settings.API_URL}/image?url=/media/products/${product.fifth_image}`} alt={product.name} />
                    </figure> : ''}
                    <article className="single__desc" dangerouslySetInnerHTML={{__html: desc4}}>

                    </article>
                </section> : ''}
            </div>
        </main> : <Loader />}
        <HomepagePopular />
        <SimilarProducts id={product?.id} />
        <Footer />
    </div>
};

export default SingleProduct;
