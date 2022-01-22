import React from 'react';
import img1 from '../static/assets/info2.png'
import arrowIcon from '../static/assets/arrow-right.svg'

const HomepageInfoSection2 = () => {
    return <>
        <section className="infoSection infoSection--2 flex">
            <article className="infoSection__content">
                <main className="infoSection__content__main">

                </main>
            </article>
            <figure className="infoSection__imgWrapper infoSection__imgWrapper--2">
                <img className="btn__img" src={img1} alt="info" />
            </figure>
        </section>
        <a className="infoSection__btn infoSection__btn--100" href="/sklep">
            Sprawdź nasze wszystkie produkty
            <img className="arrowIcon" src={arrowIcon} alt="dalej" />
        </a>
    </>
};

export default HomepageInfoSection2;
