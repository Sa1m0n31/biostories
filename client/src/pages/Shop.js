import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import Menu from "../components/Menu";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getAllProducts, getProductsByCategory} from "../helpers/productFunctions";
import ProductPreview from "../components/ProductPreview";
import convertToURL from "../helpers/convertToURL";
import settings from "../helpers/settings";
import {getCategoryBySlug} from "../helpers/categoryFunctions";
import Loader from "../components/Loader";
import HomepageInfoSection3 from "../components/HomepageInfoSection3";
import {getCustomFields} from "../admin/helpers/settingsFunctions";
import HomepageInfoSection2 from "../components/HomepageInfoSection2";
import arrowIcon from '../static/img/slider-arrow.png'

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [category, setCategory] = useState(null);
    const [render, setRender] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);

    const [fields, setFields] = useState([]);

    const getCustomField = (key) => {
        return fields.find((item) => {
            return item.custom_key === key;
        })?.custom_value;
    }

    useEffect(() => {
        getCustomFields()
            .then(res => {
                setFields(res?.data?.result);
            })
    }, []);

    useEffect(() => {
        let categoryPermalink, parentCategoryPermalink;
        const hrefItems = window.location.href.split('/');
        if(hrefItems.length > 5) {
            categoryPermalink = hrefItems[hrefItems.length-1];
            parentCategoryPermalink = hrefItems[hrefItems.length-2];
            getCategoryBySlug(categoryPermalink, parentCategoryPermalink)
                .then((res) => {
                    setCategory(res?.data?.result[0]);
                });
        }
        else if(hrefItems.length > 4) {
            categoryPermalink = hrefItems[hrefItems.length-1];
            getCategoryBySlug(categoryPermalink, null)
                .then((res) => {
                    setCategory(res?.data?.result[0]);
                });
        }
        else {
            getAllProducts()
                .then((res) => {
                    console.log(res.data.result);
                    setProducts(res?.data?.result);
                    setProductsFiltered(res?.data?.result);
                    setRender(true);
                })
        }
    }, []);

    useEffect(() => {
        if(category) {
            getProductsByCategory(category.id)
                .then((res) => {
                    setProducts(res?.data?.result);
                    setProductsFiltered(res?.data?.result);
                    setRender(true);
                });
        }
    }, [category]);

    const sortByPrice = (asc) => {
        if(asc) {
            setRender(false);
            setProductsFiltered(products.sort((a, b) => {
                return a.price <= b.price ? -1 : 1;
            }).map((item) => {
                return item;
            }));
            setRender(true);
        }
        else {
            setProductsFiltered(products.sort((a, b) => {
                return a.price <= b.price ? 1 : -1;
            }).map((item) => {
                return item;
            }));
        }
        toggleFilters();
    }

    const sortByDate = (asc) => {
        if(asc) {
            setRender(false);
            setProductsFiltered(products.sort((a, b) => {
                return new Date(a.date) <= new Date(b.date) ? -1 : 1;
            }).map((item) => {
                return item;
            }));
            setRender(true);
        }
        else {
            setProductsFiltered(products.sort((a, b) => {
                return new Date(a.date) <= new Date(b.date) ? 1 : -1;
            }).map((item) => {
                return item;
            }));
        }
        toggleFilters();
    }

    const toggleFilters = () => {
        if(filtersVisible) {
            document.querySelector('.abc').transform = 'rotate(0)';
            document.querySelector('.shop__filters').style.opacity = '0';
            document.querySelector('.shop__filters').style.zIndex = '-2';
        }
        else {
            document.querySelector('.abc').transform = 'rotate(180deg)';
            document.querySelector('.shop__filters').style.opacity = '1';
            document.querySelector('.shop__filters').style.zIndex = '2';
        }
        setFiltersVisible(!filtersVisible);
    }

    return <div className="container container--shop">
        <Header topSmall={true} />
        <TopMenu />
        <main className="page page--100">
            {render ? <header className="shop__header flex">
                <h1 className="page__header page__header--left">
                    {category ? category.name : 'Sklep'}
                </h1>
                <button className="shop__header__btn sortBtn" onClick={() => { toggleFilters(); }}>
                    Sortowanie
                    <img className="shop__arrow abc" src={arrowIcon} alt="arrow" />
                </button>
                <section className="shop__filters">
                    <button className="shop__header__btn" onClick={() => { sortByPrice(true); }}>
                        Cena: od najniższej
                    </button>
                    <button className="shop__header__btn" onClick={() => { sortByPrice(false); }}>
                        Cena: od najwyższej
                    </button>
                    <button className="shop__header__btn" onClick={() => { sortByDate(false); }}>
                        Od najnowszych
                    </button>
                    <button className="shop__header__btn" onClick={() => { sortByDate(true); }}>
                        Od najstarszych
                    </button>
                </section>
            </header> : ''}
            {render ? <main className="products flex">
                    {productsFiltered?.length ? productsFiltered?.map((item, index) => {
                        return <ProductPreview
                            key={index}
                            id={item.id}
                            title={item.name}
                            subtitle={item.subtitle}
                            link={convertToURL(item.name)}
                            price={item.price}
                            img1={`${settings.API_URL}/image?url=/media/products/${item.main_image}`}
                            img2={`${settings.API_URL}/image?url=/media/products/${item.second_image}`} />
                    }) : <div className="noProductsWrapper">
                        <h3 className="noProducts">
                            Nie znaleziono produktów...
                        </h3>
                        <a className="btn btn--back" href="/sklep">
                            Wróć do sklepu
                        </a>
                    </div>
                    }
                </main> : <Loader />}
        </main>
        <HomepageInfoSection2 img={getCustomField('image7')} article={getCustomField('article2')} />
        <Footer />
    </div>
};

export default Shop;
