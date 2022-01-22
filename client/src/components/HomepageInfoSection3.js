import React from 'react';
import img1 from '../static/assets/igm3.png'
import arrowIcon from '../static/assets/arrow-right.svg'

const HomepageInfoSection3 = () => {
    return <>
        <section className="infoSection infoSection--3 flex">
            <figure className="infoSection__imgWrapper infoSection__imgWrapper--3">
                <img className="btn__img" src={img1} alt="info" />
            </figure>
            <article className="infoSection__content">
                <main className="infoSection__content__main">

                </main>
            </article>
        </section>
    </>
};

export default HomepageInfoSection3;
