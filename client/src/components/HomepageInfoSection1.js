import React from 'react';
import img1 from '../static/assets/info1.png'
import arrowIcon from '../static/assets/arrow-right.svg'

const HomepageInfoSection1 = () => {
    return <section className="infoSection flex">
        <figure className="infoSection__imgWrapper">
            <img className="btn__img" src={img1} alt="info" />
        </figure>
        <article className="infoSection__content">
            <main className="infoSection__content__main">

            </main>
            <a className="infoSection__btn" href="/sklep">
                Sprawdź nasze wszystkie produkty
                <img className="arrowIcon" src={arrowIcon} alt="dalej" />
            </a>
        </article>
    </section>
};

export default HomepageInfoSection1;
