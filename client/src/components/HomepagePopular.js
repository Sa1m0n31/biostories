import React, {useEffect, useState} from 'react';
import ProductPreview from "./ProductPreview";
import img1 from '../static/assets/product-1.png'
import img2 from '../static/assets/product-2.png'

const HomepagePopular = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([
            { title: 'Ekologiczna herbatka', subtitle: 'Owocowa herbata ziołowa z wysoką zawartością witaminy C, liofilizowana.', price: 159.99, img1: img1, img2: img2 },
            { title: 'Ekologiczna herbatka', subtitle: 'Owocowa herbata ziołowa z wysoką zawartością witaminy C, liofilizowana.', price: 159.99, img1: img1, img2: img2 },
            { title: 'Ekologiczna herbatka', subtitle: 'Owocowa herbata ziołowa z wysoką zawartością witaminy C, liofilizowana.', price: 159.99, img1: img1, img2: img2 },
            { title: 'Ekologiczna herbatka', subtitle: 'Owocowa herbata ziołowa z wysoką zawartością witaminy C, liofilizowana.', price: 159.99, img1: img1, img2: img2 }
        ])
    }, []);

    return <section className="row row--popular">
        <h2 className="row__header">
            Najczęściej wybierane
        </h2>
        <main className="flex">
            {products.map((item, index) => {
                return <ProductPreview
                    key={index}
                    id={item.id}
                    title={item.title}
                    subtitle={item.subtitle}
                    price={item.price}
                    img1={item.img1}
                    img2={item.img2} />
            })}
        </main>
    </section>
};

export default HomepagePopular;
