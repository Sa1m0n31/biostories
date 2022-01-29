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

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [render, setRender] = useState(false);

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
                    setProducts(res?.data?.result);
                    setRender(true);
                })
        }
    }, []);

    useEffect(() => {
        if(category) {
            getProductsByCategory(category.id)
                .then((res) => {
                    setProducts(res?.data?.result);
                    setRender(true);
                });
        }
    }, [category]);

    return <div className="container">
        <Header topSmall={true} />
        <TopMenu />
        <main className="page">
            {render ? <h1 className="page__header page__header--left">
                {category ? category.name : 'Sklep'}
            </h1> : ''}
            {render ? <main className="products flex">
                    {products?.length ? products?.map((item, index) => {
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
        <Footer />
    </div>
};

export default Shop;
