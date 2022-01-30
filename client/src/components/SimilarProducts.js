import React, {useEffect, useState} from 'react';
import ProductPreview from "./ProductPreview";
import img1 from '../static/assets/product-1.png'
import img2 from '../static/assets/product-2.png'
import {getPopularProducts, getSimilarProducts} from "../helpers/productFunctions";
import settings from "../helpers/settings";

const SimilarProducts = ({id}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if(id) {
            getSimilarProducts(id)
                .then(res => {
                    setProducts(res?.data?.result);
                });
        }
    }, [id]);

    return <section className="row row--popular">
        {products?.length ?  <h2 className="row__header">
            Podobne produkty
        </h2> : ''}
        <main className="flex">
            {products.map((item, index) => {
                return <ProductPreview
                    key={index}
                    id={item.id}
                    title={item.name}
                    subtitle={item.subtitle}
                    price={item.price}
                    img1={`${settings.API_URL}/image?url=/media/products/${item.main_image}`}
                    img2={`${settings.API_URL}/image?url=/media/products/${item.second_image}`} />
            })}
        </main>
    </section>
};

export default SimilarProducts;
