import React, {useEffect, useState} from 'react';
import ProductPreview from "./ProductPreview";
import img1 from '../static/assets/product-1.png'
import img2 from '../static/assets/product-2.png'
import {getNewProducts} from "../helpers/productFunctions";
import settings from "../helpers/settings";
import convertToURL from "../helpers/convertToURL";

const HomepageNewProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getNewProducts()
            .then((res) => {
                setProducts(res?.data?.result?.slice(0, 4));
            });
    }, []);

    return <section className="row">
        <span className="anchor" id="nowosci"></span>
        <h2 className="row__header">
            Nowości
        </h2>
        <main className="flex">
            {products?.map((item, index) => {
                return <ProductPreview
                    key={index}
                    id={item.id}
                    title={item.name}
                    subtitle={item.subtitle}
                    price={item.price}
                    stock={item.stock}
                    link={convertToURL(item.name)}
                    img1={`${settings.API_URL}/image?url=/media/products/${item.main_image}`}
                    img2={`${settings.API_URL}/image?url=/media/products/${item.second_image}`} />
            })}
        </main>
    </section>
};

export default HomepageNewProducts;
