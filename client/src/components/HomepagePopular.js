import React, {useEffect, useState} from 'react';
import ProductPreview from "./ProductPreview";
import {getPopularProducts} from "../helpers/productFunctions";
import settings from "../helpers/settings";
import convertToURL from "../helpers/convertToURL";

const HomepagePopular = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getPopularProducts()
            .then((res) => {
                setProducts(res?.data?.result?.slice(0, 4));
            });
    }, []);

    return <section className="row row--popular">
        <span className="anchor" id="popularne"></span>
        <h2 className="row__header">
            Najczęściej wybierane
        </h2>
        <main className="flex">
            {products.map((item, index) => {
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

export default HomepagePopular;
