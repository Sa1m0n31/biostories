import React, {useEffect, useState} from 'react';
import Header from "../components/Header";
import Menu from "../components/Menu";
import TopMenu from "../components/TopMenu";
import Footer from "../components/Footer";
import {getAllProducts} from "../helpers/productFunctions";
import ProductPreview from "../components/ProductPreview";
import convertToURL from "../helpers/convertToURL";
import settings from "../helpers/settings";
import {getCategoryBySlug} from "../helpers/categoryFunctions";

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);

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
                    console.log(res.data.result);
                    setCategory(res?.data?.result[0]);
                });
        }
        else {
            getAllProducts()
                .then((res) => {
                    setProducts(res?.data?.result);
                })
        }
    }, []);

    return <div className="container">
        <Header topSmall={true} />
        <TopMenu />
        <main className="page">
            <h1 className="page__header page__header--left">
                {category ? category.name : 'Sklep'}
            </h1>
            <main className="products flex">
                {products?.map((item, index) => {
                    return <ProductPreview
                        key={index}
                        id={item.id}
                        title={item.name}
                        subtitle={item.subtitle}
                        link={convertToURL(item.name)}
                        price={item.price}
                        img1={`${settings.API_URL}/image?url=/media/products/${item.main_image}`}
                        img2={`${settings.API_URL}/image?url=/media/products/${item.second_image}`} />
                })}
            </main>
        </main>
        <Footer />
    </div>
};

export default Shop;
